import { useTranslation } from 'react-i18next';
import styles from './NonWorkingDays.module.scss';

type NonWorkingDaysProps = {
    days: string[] | [];
};

function NonWorkingDays({ days }: NonWorkingDaysProps) {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{t(`pages.admin.nonWorkingDaysThisMonth`)}</h2>
            <ul className={styles.list}>
                {days.map((day, index) => {
                    return (
                        <li className={styles[`list-item`]} key={`${day}-${index}`}>
                            <p>{`${day}, `}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default NonWorkingDays;
