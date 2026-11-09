import { useTranslation } from 'react-i18next';
import { PaymentRequisitesCard } from '../../../../../utils/api/financeService/financeService';
import styles from './PaymentMethods.module.scss';

function BanckCardItem({ card, onClick }: { card: PaymentRequisitesCard; onClick: (id: number) => void }) {
    const { t } = useTranslation();

    return (
        <div className={styles['bank-card']}>
            <div className={`${styles['bank-card__icon']} ${styles[`bank-card__icon_${card.payment_system}`]} `} />
            <div className={styles['bank-card__text']}>
                <p className={styles['bank-card__text_title']}>
                    <span className={styles['bank-card__dots']}></span>
                    <span>{card.number_card}</span>
                </p>
                {card.default && <p className={styles['bank-card__text_subtitle']}>{t('pages.finance.maiPaymentCard')}</p>}
            </div>
            <button type="button" className={`${styles['bank-card__button']} ${styles[`bank-card__button_delete`]} `} onClick={() => onClick(card.id)} />
        </div>
    );
}

function CardItem({ title, onClick }: { title: string; onClick: () => void }) {
    return (
        <div className={styles['bank-card']}>
            <div className={`${styles['bank-card__icon']} ${styles[`bank-card__icon_mastercard`]} `} />
            <p className={styles['bank-card__label']}>{title}</p>
            <button type="button" className={`${styles['bank-card__button']} ${styles[`bank-card__button_add`]} `} onClick={onClick} />
        </div>
    );
}

type PaymentMethodsProps = {
    cards: PaymentRequisitesCard[];
    onDelete: (id: number) => void;
    onAdd: () => void;
};

function PaymentMethods({ cards, onDelete, onAdd }: PaymentMethodsProps) {
    const { t } = useTranslation();

    return (
        <div className={styles['payment-methods']}>
            <p className={styles['payment-methods__title']}>{t('pages.finance.replenishmentCards')}</p>
            {cards.map((card) => (
                <BanckCardItem key={card.id} card={card} onClick={onDelete} />
            ))}

            <CardItem title={t('pages.finance.addNewCard')} onClick={onAdd} />
        </div>
    );
}

export default PaymentMethods;
