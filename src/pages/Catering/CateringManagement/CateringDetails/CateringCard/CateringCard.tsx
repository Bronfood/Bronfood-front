import { Catering } from '../../../../../utils/api/cateringService/cateringService';
import styles from './CateringCard.module.scss';
import ButtonIconRound from '../../../../../components/ButtonIconRound/ButtonIconRound';
import Button from '../../../../../components/Button/Button';
import { useTranslation } from 'react-i18next';

type CateringCardProps = {
    card: Catering;
    onDelete?: () => void;
    onCopy?: () => void;
};

const CateringCard = ({ card, onDelete, onCopy }: CateringCardProps) => {
    const { t } = useTranslation();
    return (
        <div className={styles.card}>
            <div className={styles.card__container}>
                <div className={styles.card__image} style={{ backgroundImage: `url(${card.photo})` }} />
                {onDelete && (
                    <div className={styles.card__delete}>
                        <ButtonIconRound icon="delete" onClick={onDelete} />
                    </div>
                )}
                <div className={styles.card__description}>
                    <div className={styles.card__title_container}>
                        <p className={styles.card__title}>{card.name}</p>
                        <p className={styles.card__rating}>{card.rating}</p>
                        <div className={`${styles.card__icon} ${styles.card__icon_star} ${styles.card__icon_large}`} />
                    </div>
                    <div className={styles.card__feature}>
                        <div className={`${styles.card__icon} ${styles.card__icon_placemark} ${styles.card__icon_small}`} />
                        <p className={styles.card__feature_title}>{card.address}</p>
                    </div>
                </div>
                {onCopy && (
                    <div className={styles.card__copy}>
                        <Button onClick={onCopy}>{t('pages.cateringManagement.copyMenu')}</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CateringCard;
