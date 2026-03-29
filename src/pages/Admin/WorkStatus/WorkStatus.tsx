import { useEffect, useMemo, useState } from 'react';
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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { start, end } = getStartEndDatesOfMonth(date);
    const { data, isSuccess, isPending, refetch: refetchSchedules } = useGetAdminSchedules(start, end);
    const { addSchedule } = useAdminScheduleMutations();
    const addScheduleErrorMessage = addSchedule.isError ? getErrorMessage(addSchedule.error, 'pages.admin.') : '';
    const schedules: Schedule[] = useMemo(() => (isSuccess ? data.data : []), [isSuccess, data?.data]);
    const modifiers = getModifiers(schedules, ['regular', 'override', 'closed']);
    const {
        register,
        handleSubmit,
        reset: formReset,
        formState: { isDirty, errors },
    } = useForm({ mode: 'onBlur', defaultValues: { openTime, closeTime }, values: { openTime, closeTime } });
    const close = () => {
        navigate('/admin');
    };
    const handleDateChange = (date: Date) => {
        if (isDirty) {
            setIsConfirmationPopupOpen(true);
        } else {
            setDate(date);
        }
        setSelectedDate(date);
    };
    const handleReset = (date: Date | undefined) => {
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
                        <InputTime name="openTime" register={register} errors={errors} value={openTime} placeholder="HH:MM"></InputTime>
                        <div className={styles.line}></div>
                        <InputTime name="closeTime" register={register} errors={errors} value={closeTime} placeholder="HH:MM"></InputTime>
                    </fieldset>
                </Form>
                {isPending ? <Preloader /> : <DatePicker modifiers={modifiers} month={date} onDateChange={handleDateChange} />}
            </AdminPopup>
            {isConfirmationPopupOpen && <AdminConfirmation formId="work-status" close={() => handleReset(selectedDate)} question="saveChanges" isLoading={addSchedule.isPending} isError={addSchedule.isError} errorMessage={addScheduleErrorMessage} />}
        </>
    );
}

export default WorkStatus;

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
        if (Array.isArray(result[item.source])) {
            const date = formatStringToDate(item.date);
            result[item.source].push(date);
        }
        return result;
    }, acc);
}
