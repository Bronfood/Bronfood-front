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
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';

function WorkStatus() {
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const year = useMemo(() => date.getFullYear(), [date]);
    const month = useMemo(() => date.getMonth(), [date]);
    const start = useMemo(() => getFirstDayOfMonth(year, month), [year, month]);
    const end = useMemo(() => getLastDayOfMonth(year, month), [year, month]);
    const { data, isSuccess, isPending } = useGetAdminSchedules(start, end);
    const { addSchedule } = useAdminScheduleMutations();
    const schedules: Schedule[] = isSuccess ? data.data : [];
    const formattedSelectedDate = selectedDate && formatDate(selectedDate);
    const selectedSchedule = formattedSelectedDate ? schedules.find((schedule) => schedule.date === formattedSelectedDate) : undefined;
    const openTime = selectedSchedule ? selectedSchedule.open_time : '';
    const closeTime = selectedSchedule ? selectedSchedule.close_time : '';
    const {
        register,
        handleSubmit,
        formState: { isDirty, errors },
    } = useForm({ mode: 'onBlur', defaultValues: { openTime, closeTime } });
    const close = () => {
        navigate('/admin');
    };
    const handleDayBlur = () => {
        if (isDirty) setIsConfirmationPopupOpen(true);
    };
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { openTime, closeTime } = data;
        await addSchedule.mutateAsync({ date, openTime, closeTime });
        setIsConfirmationPopupOpen(false);
    };

    return (
        <>
            <AdminPopup close={close}>
                <h1 className={styles.title}>{t(`pages.admin.workStatus`)}</h1>
                <Form name="work-status" id="work-status" onSubmit={handleSubmit(onSubmit)}>
                    {addSchedule.isError && <ErrorMessage message={addSchedule.error.message} />}
                    <fieldset className={styles.fieldset} disabled={isPending}>
                        <InputTime name="openTime" register={register} errors={errors} value={openTime} placeholder="HH:MM"></InputTime>
                        <div className={styles.line}></div>
                        <InputTime name="closeTime" register={register} errors={errors} value={closeTime} placeholder="HH:MM"></InputTime>
                    </fieldset>
                </Form>
                {isPending ? <Preloader /> : <DatePicker month={date} setMonth={setDate} selected={selectedDate} setSelected={setSelectedDate} onDayBlur={handleDayBlur} />}
            </AdminPopup>
            {isConfirmationPopupOpen && <AdminConfirmation formId="work-status" close={() => setIsConfirmationPopupOpen(false)} question="saveChanges" /* isLoading={changeAdminOrderStatus.isPending} */ />}
        </>
    );
}

export default WorkStatus;
