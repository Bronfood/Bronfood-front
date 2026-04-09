import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import styles from './WorkStatus.module.scss';
import { useNavigate } from 'react-router-dom';
import AdminPopup from '../AdminPopup/AdminPopup';
import { DatePicker } from '../../../components/DatePicker/DatePicker';
import { useTranslation } from 'react-i18next';
import { useAdminScheduleMutations, useGetAdminSchedules } from '../../../utils/hooks/useAdminSchedules/useAdminSchedules';
import Preloader from '../../../components/Preloader/Preloader';
import { Schedule } from '../../../utils/api/adminService/adminService';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { InputTime } from '../../../components/InputTime/InputTime';
import AdminConfirmation from '../AdminConfirmation/AdminConfirmation';
import Form from '../../../components/Form/Form';
import { getErrorMessage } from '../../../utils/serviceFuncs/getErrorMessage';
import { formatDateToString } from '../../../utils/serviceFuncs/formatDateToString';
import { formatStringToDate } from '../../../utils/serviceFuncs/formatStringToDate';
import Button from '../../../components/Button/Button';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import Checkbox from '../../../components/Checkbox/Checkbox';

type Time = {
    openTime: string | null;
    closeTime: string | null;
};

function WorkStatus() {
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [{ openTime, closeTime }, setTime] = useState<Time>({
        openTime: '',
        closeTime: '',
    });
    const [isLegendOpen, setIsLegendOpen] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { start, end } = getStartEndDatesOfMonth(date);
    const { data, isSuccess, isPending, refetch: refetchSchedules } = useGetAdminSchedules(start, end);
    const { addSchedule } = useAdminScheduleMutations();
    const addScheduleErrorMessage = addSchedule.isError ? getErrorMessage(addSchedule.error, 'pages.admin.') : '';
    const schedules: Schedule[] = useMemo(() => (isSuccess ? data.data : []), [isSuccess, data?.data]);
    const modifiers = useMemo(() => getModifiers(schedules, ['regular', 'override', 'closed']), [schedules]);
    const {
        register,
        handleSubmit,
        reset: formReset,
        setValue,
        formState: { isDirty, errors, isValid },
    } = useForm({ mode: 'onBlur', defaultValues: { openTime: '', closeTime: '' }, values: { openTime, closeTime } });
    const close = () => {
        navigate('/admin');
    };
    const handleDateChange = (date: Date) => {
        if (addSchedule.isError) {
            setSelectedDate(date);
            handleReset();
            return;
        }
        if (isDirty) {
            setIsConfirmationPopupOpen(true);
        } else {
            setDate(date);
        }
        setSelectedDate(date);
    };
    const handleReset = (date?: Date | undefined) => {
        setIsConfirmationPopupOpen(false);
        addSchedule.reset();
        formReset();
        if (date) setDate(date);
    };
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { openTime, closeTime } = data;
        await addSchedule.mutateAsync({ date, openTime, closeTime });
        handleReset(selectedDate);
        refetchSchedules();
    };

    useEffect(() => {
        setTime(getOpenCloseTimes(schedules, date));
    }, [schedules, date]);

    return (
        <>
            <AdminPopup close={close}>
                <h1 className={styles.title}>{t(`pages.admin.workStatus`)}</h1>
                <Form name="work-status" id="work-status" onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className={styles.fieldset} disabled={isPending}>
                        <InputTime name="openTime" register={register} errors={errors} value={openTime} placeholder="HH:MM" disabled={!selectedDate}></InputTime>
                        <span className={styles.line}>—</span>
                        <InputTime name="closeTime" register={register} errors={errors} value={closeTime} placeholder="HH:MM" disabled={!selectedDate}></InputTime>
                    </fieldset>
                    <Checkbox
                        initialState={false}
                        text={t(`pages.admin.makeItaDayOff`)}
                        disabled={!selectedDate}
                        setValue={() => {
                            setValue('openTime', null, { shouldDirty: true });
                            setValue('closeTime', null);
                        }}
                        resetValue={() => formReset()}
                    />
                    {addSchedule.isError ? <ErrorMessage message={addScheduleErrorMessage} /> : <Legend initialState={isLegendOpen} setInitialState={setIsLegendOpen} />}
                    {addSchedule.isPending && <Preloader />}
                    <Button style={{ marginTop: 0 }} form="work-status" disabled={!isDirty || !isValid}>
                        {t(`pages.admin.saveChanges`)}
                    </Button>
                </Form>
                {isPending ? <Preloader /> : <DatePicker modifiers={modifiers} month={date} onDateChange={handleDateChange} />}
            </AdminPopup>
            {isConfirmationPopupOpen && <AdminConfirmation formId="work-status" close={() => handleReset(selectedDate)} question="saveChangesQuestion" isLoading={addSchedule.isPending} isError={addSchedule.isError} errorMessage={addScheduleErrorMessage} />}
        </>
    );
}

export default WorkStatus;

function Legend({ initialState, setInitialState }: { initialState: boolean; setInitialState: Dispatch<SetStateAction<boolean>> }) {
    const [isOpen, setIsOpen] = useState(initialState);
    const ref = useRef<HTMLDivElement>(null);
    const toggleAccordion = () => {
        if (ref.current) {
            if (ref.current.style.maxHeight) {
                ref.current.style.maxHeight = '';
            } else {
                ref.current.style.maxHeight = ref.current.scrollHeight + 'px';
            }
            setIsOpen(!isOpen);
        }
    };
    useEffect(() => {
        if (isOpen && ref.current) {
            ref.current.style.maxHeight = ref.current.scrollHeight + 'px';
        }
    }, [isOpen]);

    const { t } = useTranslation();
    return (
        <li className={styles.accordion}>
            <div
                className={styles.accordion__summary}
                onClick={() => {
                    setInitialState(!initialState);
                    toggleAccordion();
                }}
            >
                <div className={`${styles.accordion__icon} ${isOpen ? styles.accordion__icon_active : ''}`} />
            </div>
            <div ref={ref} className={styles.accordion__details}>
                <div className={styles.legend}>
                    <div className={styles.legend__item}>
                        <div className={`${styles.legend__icon} ${styles.legend__icon_regular}`}></div>
                        <p className={styles.legend__text}>{t(`pages.admin.regularSchedule`)}</p>
                    </div>
                    <div className={styles.legend__item}>
                        <div className={`${styles.legend__icon} ${styles.legend__icon_override}`}></div>
                        <p className={styles.legend__text}>{t(`pages.admin.overridenSchedule`)}</p>
                    </div>
                    <div className={styles.legend__item}>
                        <div className={`${styles.legend__icon} ${styles.legend__icon_closed}`}></div>
                        <p className={styles.legend__text}>{t(`pages.admin.closed`)}</p>
                    </div>
                </div>
            </div>
        </li>
    );
}

function getStartEndDatesOfMonth(date: Date) {
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1);
    const getLastDayOfMonth = (year: number, month: number) => new Date(year, month + 1, 0);
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = getFirstDayOfMonth(year, month);
    const end = getLastDayOfMonth(year, month);
    return {
        start,
        end,
    };
}

function getOpenCloseTimes(schedules: Schedule[], date: Date) {
    const formattedDate = formatDateToString(date);
    const schedule = schedules.find((schedule) => schedule.date === formattedDate);
    const openTime = schedule ? schedule.open_time : '';
    const closeTime = schedule ? schedule.close_time : '';
    return {
        openTime,
        closeTime,
    };
}

function getModifiers(schedules: Schedule[], sources: string[]) {
    const acc: Record<string, Date[]> = sources.reduce((obj: { [key: string]: Date[] }, key) => {
        obj[key] = [];
        return obj;
    }, {});
    return schedules.reduce((result, item) => {
        const date = formatStringToDate(item.date);
        if (Array.isArray(result[item.source])) {
            result[item.source].push(date);
        } else {
            result[item.source] = [date];
        }
        if (item.open_time === null && item.close_time === null) {
            result['closed'].push(date);
        }
        return result;
    }, acc);
}
