import { useMemo, useState } from 'react';
import styles from './WorkStatus.module.scss';
import { useNavigate } from 'react-router-dom';
import AdminPopup from '../AdminPopup/AdminPopup';
import { DatePicker } from '../../../components/DatePicker/DatePicker';
import { useTranslation } from 'react-i18next';
import WorkingHours from './WorkingHours/WorkingHours';
import { useGetAdminSchedules } from '../../../utils/hooks/useAdminSchedules/useAdminSchedules';
import Preloader from '../../../components/Preloader/Preloader';
import { Schedule } from '../../../utils/api/adminService/adminService';
import { formatDate } from '../../../utils/serviceFuncs/formatDate';
import { getLastDayOfMonth } from '../../../utils/serviceFuncs/getLastDayOfMonth';
import { getFirstDayOfMonth } from '../../../utils/serviceFuncs/getFirstDayOfMonth';

function WorkStatus() {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const year = useMemo(() => date.getFullYear(), [date]);
    const month = useMemo(() => date.getMonth(), [date]);
    const start = useMemo(() => getFirstDayOfMonth(year, month), [year, month]);
    const end = useMemo(() => getLastDayOfMonth(year, month), [year, month]);
    const { data, isSuccess, isPending } = useGetAdminSchedules(start, end);
    const schedules: Schedule[] = isSuccess ? data.data : [];
    const formattedSelectedDate = selectedDate && formatDate(selectedDate);
    const selectedSchedule = formattedSelectedDate ? schedules.find((schedule) => schedule.date === formattedSelectedDate) : undefined;
    const openTime = selectedSchedule ? selectedSchedule.open_time : '';
    const closeTime = selectedSchedule ? selectedSchedule.close_time : '';
    const close = () => {
        navigate('/admin');
    };

    return (
        <>
            <AdminPopup close={close}>
                <h1 className={styles.title}>{t(`pages.admin.workStatus`)}</h1>
                <WorkingHours openTime={openTime} closeTime={closeTime} />
                {isPending ? <Preloader /> : <DatePicker month={date} setMonth={setDate} selected={selectedDate} setSelected={setSelectedDate} />}
            </AdminPopup>
        </>
    );
}

export default WorkStatus;
