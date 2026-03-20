import { useState } from 'react';
import styles from './WorkStatus.module.scss';
import { useNavigate } from 'react-router-dom';
import AdminPopup from '../AdminPopup/AdminPopup';
import { DatePicker } from '../../../components/DatePicker/DatePicker';
import { useTranslation } from 'react-i18next';
import WorkingHours from './WorkingHours/WorkingHours';
import { useGetAdminSchedules } from '../../../utils/hooks/useAdminSchedules/useAdminSchedules';
import Preloader from '../../../components/Preloader/Preloader';

function WorkStatus() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const start = new Date('2026-03-10T16:45:30');
    const end = new Date('2026-03-15T16:45:30');
    const { isPending } = useGetAdminSchedules(start, end);

    const close = () => {
        navigate('/admin');
    };

    return (
        <>
            <AdminPopup close={close}>
                <h1 className={styles.title}>{t(`pages.admin.workStatus`)}</h1>
                <WorkingHours openTime="9:00" closeTime="21:00" />
                {isPending ? <Preloader /> : <DatePicker selected={selectedDate} setSelected={setSelectedDate} />}
            </AdminPopup>
        </>
    );
}

export default WorkStatus;
