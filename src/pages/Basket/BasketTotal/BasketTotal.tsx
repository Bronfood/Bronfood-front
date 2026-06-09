import { useTranslation } from 'react-i18next';
import styles from './BasketTotal.module.scss';
import Button from '../../../components/Button/Button';

function BasketTotal({ price, onPayOrderClick }: { price: number; onPayOrderClick: () => void }) {
    const { t } = useTranslation();
    return (
        <div className={styles['basket-total']}>
            <div className={styles['basket-total__title']}>
                <p className={styles['basket-total__text']}>{t(`pages.basket.total`)}</p>
                <span className={styles['basket-total__price']}>{`${price} ₸`}</span>
            </div>
            <div className={styles['basket-total__button']}>
                <Button onClick={onPayOrderClick}>{t(`pages.basket.pay`)}</Button>
            </div>
        </div>
    );
}

export default BasketTotal;
