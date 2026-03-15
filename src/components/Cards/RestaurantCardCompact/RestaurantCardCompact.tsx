import { Catering, Day } from '../../../utils/api/cateringService/cateringService';
import styles from './RestaurantCardCompact.module.scss';
import { useTranslation } from 'react-i18next';

function RestaurantCardCompact({ card }: { card: Catering }) {
    const { t } = useTranslation();

    const formatWorkingTime = (schedule?: Day[]) => {
        if (!schedule || !schedule.length || !schedule[0].open_time || !schedule[0].close_time) {
            return t('pages.cateringManagement.noWorkingTime');
        }
        return `${schedule[0].open_time.slice(0, 5)} - ${schedule[0].close_time.slice(0, 5)}`;
    };

    return (
        <div className={styles.card}>
            <div className={styles.card__container}>
                <div>
                    <div className={styles.card__image} style={{ backgroundImage: `url(${card.photo})` }} />
                </div>
                <div className={styles.card__description}>
                    <p className={styles.card__title}>{card.name}</p>
                    <div className={styles.card__feature}>
                        <div className={`${styles.card__icon} ${styles.card__icon_placemark} ${styles.card__icon_small}`} />
                        <p className={styles.card__feature_title}>{card.address}</p>
                    </div>
                    <div className={styles.card__feature}>
                        <div className={`${styles.card__icon} ${styles.card__icon_clock} ${styles.card__icon_small}`} />
                        <p className={styles.card__feature_title}>{formatWorkingTime(card.schedule)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RestaurantCardCompact;
