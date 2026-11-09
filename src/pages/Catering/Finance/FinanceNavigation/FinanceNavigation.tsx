import { useTranslation } from 'react-i18next';
import styles from './FinanceNavigation.module.scss';
import { useNavigate } from 'react-router-dom';

type FinanceNavigationCardProps = {
    icon: 'marketplace' | 'wallet';
    title: string;
    subtitle: string;
    onClick: () => void;
};

function FinanceNavigationCard({ icon, title, subtitle, onClick }: FinanceNavigationCardProps) {
    return (
        <button type="button" className={styles['card']} onClick={onClick}>
            <div className={`${styles['card__icon']} ${styles[`card__icon_${icon}`]} `} />
            <div className={styles['card__text']}>
                <p className={styles['card__text_title']}>{title}</p>
                <p className={styles['card__text_subtitle']}>{subtitle}</p>
            </div>
            <div className={styles['card__arrow']} />
        </button>
    );
}

function FinanceNavigation() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleNavClick = (path: string) => {
        navigate(`/catering/finance/${path}`);
    };

    return (
        <div className={styles.navigation}>
            <FinanceNavigationCard icon="wallet" title={t('pages.finance.walletCRM')} subtitle={t('pages.finance.useBronfoodCRM')} onClick={() => handleNavClick('wallet')} />
            <FinanceNavigationCard icon="marketplace" title={t('pages.finance.payoutsMarketplace')} subtitle={t('pages.finance.requisitesForGet')} onClick={() => handleNavClick('marketplace')} />
        </div>
    );
}

export default FinanceNavigation;
