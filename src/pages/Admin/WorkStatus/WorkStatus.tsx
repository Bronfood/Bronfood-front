import { useMemo, useState } from 'react';
import styles from './WorkStatus.module.scss';
import { useNavigate } from 'react-router-dom';
import AdminPopup from '../AdminPopup/AdminPopup';
import { DatePicker } from '../../../components/DatePicker/DatePicker';
import { useTranslation } from 'react-i18next';
import { useAdminScheduleMutations, useGetAdminSchedules } from '../../../utils/hooks/useAdminSchedules/useAdminSchedules';
import Preloader from '../../../components/Preloader/Preloader';
import { Schedule } from '../../../utils/api/adminService/adminService';
import { formatDate } from '../../../utils/serviceFuncs/formatDate';
import { getLastDayOfMonth } from '../../../utils/serviceFuncs/getLastDayOfMonth';
import { getFirstDayOfMonth } from '../../../utils/serviceFuncs/getFirstDayOfMonth';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { InputTime } from '../../../components/InputTime/InputTime';
import AdminConfirmation from '../AdminConfirmation/AdminConfirmation';
import Form from '../../../components/Form/Form';
import { getErrorMessage } from '../../../utils/serviceFuncs/getErrorMessage';

function WorkStatus() {
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
    const [today, setToday] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [dirtyDate, setDirtyDate] = useState<Date | undefined>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const year = useMemo(() => today.getFullYear(), [today]);
    const month = useMemo(() => today.getMonth(), [today]);
    const start = useMemo(() => getFirstDayOfMonth(year, month), [year, month]);
    const end = useMemo(() => getLastDayOfMonth(year, month), [year, month]);
    const { data, isSuccess, isPending, refetch: refetchSchedules } = useGetAdminSchedules(start, end);
    const { addSchedule } = useAdminScheduleMutations();
    const addScheduleErrorMessage = addSchedule.isError ? getErrorMessage(addSchedule.error, 'pages.admin.') : '';
    const schedules: Schedule[] = isSuccess ? data.data : [];
    const formattedSelectedDate = selectedDate && formatDate(selectedDate);
    const selectedSchedule = formattedSelectedDate ? schedules.find((schedule) => schedule.date === formattedSelectedDate) : undefined;
    const openTime = selectedSchedule ? selectedSchedule.open_time : '';
    const closeTime = selectedSchedule ? selectedSchedule.close_time : '';
    const {
        register,
        handleSubmit,
        reset: formReset,
        formState: { isDirty, errors },
    } = useForm({ mode: 'onBlur', defaultValues: { openTime, closeTime }, values: { openTime, closeTime } });
    const close = () => {
        navigate('/admin');
    };
    const handleCalendarChange = () => {
        if (isDirty) {
            setIsConfirmationPopupOpen(true);
        }
    };
    const handleDayBlur = (date) => {
        if (dirtyDate) return;
        setDirtyDate(date);
    };
    const handleReset = (date) => {
        setIsConfirmationPopupOpen(false);
        addSchedule.reset();
        formReset();
        setSelectedDate(date);
        setDirtyDate();
    };
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { openTime, closeTime } = data;
        await addSchedule.mutateAsync({ date: dirtyDate, openTime, closeTime });
        handleReset(dirtyDate);
        refetchSchedules();
    };

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
                {isPending ? <Preloader /> : <DatePicker month={today} setMonth={setToday} selected={selectedDate} onSelect={setSelectedDate} onChange={handleCalendarChange} onDayBlur={handleDayBlur} />}
            </AdminPopup>
            {isConfirmationPopupOpen && <AdminConfirmation formId="work-status" close={handleReset} question="saveChanges" isLoading={addSchedule.isPending} isError={addSchedule.isError} errorMessage={addScheduleErrorMessage} />}
        </>
    );
}

export default WorkStatus;
