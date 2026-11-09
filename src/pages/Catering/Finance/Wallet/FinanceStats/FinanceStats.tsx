import { useTranslation } from 'react-i18next';
import styles from './FinanceStats.module.scss';

type StatItemProps = {
    icon: 'catering' | 'wallet' | 'calendar' | 'time';
    title: string;
    subtitle: string;
};

function StatItem({ icon, title, subtitle }: StatItemProps) {
    return (
        <li className={styles['item']}>
            <div className={`${styles['item__icon']} ${styles[`item__icon_${icon}`]}`} />
            <div className={styles['item__text']}>
                <p className={styles['item__text_title']}>{title}</p>
                <p className={styles['item__text_subtitle']}>{subtitle}</p>
            </div>
        </li>
    );
}

function FinanceStats({ subtitle }: { subtitle: { subtitleCatering: string; subtitleDebitPerDay: string; subtitleDebtPerMonth: string; subtitleBalanceIsEnough: string } }) {
    const { t } = useTranslation();

    return (
        <ul className={styles['stats']}>
            <StatItem icon="catering" title={t('pages.finance.activeCatering')} subtitle={subtitle.subtitleCatering} />
            <StatItem icon="wallet" title={t('pages.finance.debitPerDay')} subtitle={subtitle.subtitleDebitPerDay} />
            <StatItem icon="calendar" title={t('pages.finance.debtPerMonth')} subtitle={subtitle.subtitleDebtPerMonth} />
            <StatItem icon="time" title={t('pages.finance.balanceIsEnough')} subtitle={subtitle.subtitleBalanceIsEnough} />
        </ul>
    );
}

export default FinanceStats;
