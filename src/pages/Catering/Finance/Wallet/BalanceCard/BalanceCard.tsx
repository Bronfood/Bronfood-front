import { useTranslation } from 'react-i18next';
import styles from './BalanceCard.module.scss';

type BalanceCardProps = {
    balance: number;
    onClick: () => void;
    isClick: boolean;
    dailyDeduction: number;
};

function BalanceCard({ balance, onClick, isClick, dailyDeduction }: BalanceCardProps) {
    const { t } = useTranslation();
    const isLowBalance = balance < dailyDeduction;

    return (
        <div className={styles['card']}>
            <div className={styles['card__title']}>
                <p className={styles['card__title_text']}>{t('pages.finance.currentBalance')}</p>{' '}
                <button type="button" className={`${styles['card__button']} ${isClick ? styles['card__button_hide'] : ''}`} onClick={onClick}>
                    {!isClick ? t('pages.finance.refill') : t('pages.finance.hide')}
                </button>
            </div>

            <div>
                {isLowBalance && <p className={styles['card__warning']}>{t('pages.finance.refillWalletToAvoidCRMSuspension')}</p>}
                <p className={`${styles['card__balance']} ${isLowBalance ? styles['card__balance_warning'] : ''}`}>{`${balance.toLocaleString('ru-RU')} ₸`}</p>
            </div>
        </div>
    );
}

export default BalanceCard;
