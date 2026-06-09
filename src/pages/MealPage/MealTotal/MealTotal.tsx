import { useTranslation } from 'react-i18next';
import styles from './MealTotal.module.scss';
import Button from '../../../components/Button/Button';

function MealTotal({ price, buttonDisabled }: { price: number; buttonDisabled: boolean }) {
    const { t } = useTranslation();
    return (
        <div className={styles['meal-total']}>
            <div className={styles['meal-total__title']}>
                <p className={styles['meal-total__text']}>{t(`pages.meal.total`)}</p>
                <span className={styles['meal-total__price']}>{`${price} ₸`}</span>
            </div>
            <div className={styles['meal-total__button']}>
                <Button type="submit" disabled={buttonDisabled}>
                    {t(`pages.meal.add`)}
                </Button>
            </div>
        </div>
    );
}

export default MealTotal;
