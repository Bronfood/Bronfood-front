import { useMemo, useState } from 'react';
import styles from './WorkStatus.module.scss';
import { useNavigate } from 'react-router-dom';
import AdminPopup from '../AdminPopup/AdminPopup';
import { DatePicker } from '../../../components/DatePicker/DatePicker';
import { useTranslation } from 'react-i18next';
import NonWorkingDays from './NonWorkingDays/NonWorkingDays';
import WorkingHours from './WorkingHours/WorkingHours';

function WorkStatus() {
    const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
    const nonWorkingDays = useMemo(() => (selectedDates ? selectedDates.map((date) => date.getDate().toString()) : []), [selectedDates]);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const close = () => {
        navigate('/admin');
    };

    return (
        <>
            <AdminPopup close={close}>
                <h1 className={styles.title}>{t(`pages.admin.workStatus`)}</h1>
                <WorkingHours openTime="9:00" closeTime="21:00" />
                <NonWorkingDays days={nonWorkingDays} />
                <DatePicker selected={selectedDates} setSelected={setSelectedDates} />
            </AdminPopup>
        </>
    );
}

export default WorkStatus;
