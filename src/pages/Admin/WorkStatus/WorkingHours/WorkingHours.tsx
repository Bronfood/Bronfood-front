import { useTranslation } from 'react-i18next';
import styles from './WorkingHours.module.scss';

type WorkingHoursProps = {
    openTime: string;
    closeTime: string;
};

function WorkingHours({ openTime, closeTime }: WorkingHoursProps) {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{t(`pages.admin.workingHours`)}</h2>
            <div className={styles[`input-container`]}>
                <div className={styles.input}>
                    <p className={styles.text}>{openTime}</p>
                </div>
                <div className={styles.line}></div>
                <div className={styles.input}>
                    <p className={styles.text}>{closeTime}</p>
                </div>
            </div>
        </div>
    );
}

export default WorkingHours;
