import { useState } from 'react';
import styles from './WorkStatus.module.scss';
import { useNavigate } from 'react-router-dom';
import AdminPopup from '../AdminPopup/AdminPopup';
import { DatePicker } from '../../../components/DatePicker/DatePicker';
import { useTranslation } from 'react-i18next';

function WorkStatus() {
    const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const close = () => {
        navigate('/admin');
    };

    return (
        <>
            <AdminPopup close={close}>
                <h1 className={styles.title}>{t(`pages.admin.workStatus`)}</h1>
                <DatePicker selected={selectedDates} setSelected={setSelectedDates} />
            </AdminPopup>
        </>
    );
}

export default WorkStatus;
