import { weekdayNames } from '../../../../../utils/api/cateringService/cateringService';
import styles from './WeeklyButtons.module.scss';
import { useTranslation } from 'react-i18next';

type WeeklyButtonsProps = {
    onDayClick: (day: string) => void;
    selectedDay: string | null;
    hasDailyCategories: string[];
};

const WeeklyButtons = ({ onDayClick, selectedDay, hasDailyCategories }: WeeklyButtonsProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.buttons}>
            {weekdayNames.map((day) => {
                const hasData = hasDailyCategories.includes(day);

                return (
                    <button onClick={() => onDayClick(day)} key={day} type="button" className={`${styles.buttons__item} ${selectedDay === day ? styles.selected : ''}`}>
                        <p className={` ${styles.buttons__text} ${selectedDay === day ? styles.selected__text : ''}`}>{t(`pages.cateringManagement.${day}`)}</p>
                        {selectedDay !== day && !hasData ? <div className={styles.buttons__icon}></div> : ''}
                    </button>
                );
            })}
        </div>
    );
};

export default WeeklyButtons;
