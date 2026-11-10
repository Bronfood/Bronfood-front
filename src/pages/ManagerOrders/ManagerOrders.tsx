import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button/Button';
import styles from './ManagerOrders.module.scss';

type DeliveryType = 'pickup' | 'delivery';
type PaymentType = 'paid' | 'notPaid' | 'marketplace';
type OrderTab = 'new' | 'inProgress' | 'ready' | 'preorder';

type OrderMeal = {
    name: string;
    count: number;
    price: number;
};

type ManagerOrder = {
    id: number;
    orderCode: string;
    userName: string;
    delivery: DeliveryType;
    price: number;
    meals: OrderMeal[];
    payment: PaymentType;
};

/**
 * Temporary mocked data for the manager orders screen.
 * Should be replaced with real data from the admin service once the API is ready.
 */
const orders: ManagerOrder[] = [
    {
        id: 1,
        orderCode: '#LKJ65',
        userName: 'Иван',
        delivery: 'pickup',
        price: 2600,
        meals: [
            { name: 'Донер', count: 1, price: 800 },
            { name: 'Сырный соус', count: 2, price: 400 },
            { name: 'Картофель фри', count: 1, price: 1200 },
        ],
        payment: 'paid',
    },
    {
        id: 2,
        orderCode: '#LKJ65',
        userName: 'Иван',
        delivery: 'pickup',
        price: 2600,
        meals: [
            { name: 'Донер', count: 1, price: 800 },
            { name: 'Сырный соус', count: 1, price: 400 },
            { name: 'Кебаб', count: 1, price: 1400 },
        ],
        payment: 'notPaid',
    },
    {
        id: 3,
        orderCode: '#DDR65',
        userName: 'Bronfood',
        delivery: 'delivery',
        price: 2600,
        meals: [
            { name: 'Донер', count: 1, price: 800 },
            { name: 'Сырный соус', count: 1, price: 400 },
            { name: 'Кебаб', count: 1, price: 1400 },
        ],
        payment: 'marketplace',
    },
];

const tabs: { name: OrderTab; count: number }[] = [
    { name: 'new', count: 1 },
    { name: 'inProgress', count: 2 },
    { name: 'ready', count: 3 },
    { name: 'preorder', count: 0 },
];

function PaymentToggle({ isChecked, onChange, ariaLabel }: { isChecked: boolean; onChange: () => void; ariaLabel: string }) {
    return (
        <label className={styles.toggle}>
            <input className={styles.toggle__input} type="checkbox" checked={isChecked} onChange={onChange} aria-label={ariaLabel} />
            <span className={styles.toggle__track} />
        </label>
    );
}

function OrderCard({ order }: { order: ManagerOrder }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(order.payment === 'paid');
    const [isPaid, setIsPaid] = useState(order.payment === 'paid');
    const summary = order.meals.map((meal) => meal.name).join(', ');

    return (
        <li className={`${styles.card} ${isOpen ? styles.card_open : ''}`}>
            <button type="button" className={styles.card__summary} onClick={() => setIsOpen(!isOpen)}>
                <span className={styles.card__code}>{order.orderCode}</span>
                <span className={styles.card__user}>{order.userName}</span>
                <span className={styles.card__badge}>{t(`pages.managerOrders.${order.delivery}`)}</span>
                <span className={styles.card__price}>{`${order.price} ₸`}</span>
                <span className={`${styles.card__chevron} ${isOpen ? styles.card__chevron_open : ''}`} />
            </button>

            {isOpen ? (
                <ul className={styles.card__meals}>
                    {order.meals.map((meal, index) => (
                        <li key={`${meal.name}-${index}`} className={styles.card__meal}>
                            <span className={styles.card__meal_name}>
                                {meal.name}
                                {meal.count > 1 ? <span className={styles.card__meal_count}>{` x${meal.count}`}</span> : null}
                            </span>
                            <span className={styles.card__meal_price}>{`${meal.price} ₸`}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.card__text}>{summary}</p>
            )}

            <hr className={styles.card__divider} />

            {order.payment === 'marketplace' ? (
                <div className={styles.card__marketplace}>
                    <span className={styles.card__marketplace_icon} />
                    <span className={styles.card__marketplace_text}>{t('pages.managerOrders.paidByMarketplace')}</span>
                </div>
            ) : (
                <div className={styles.card__payment}>
                    <span className={styles.card__payment_text}>{isPaid ? t('pages.managerOrders.paid') : t('pages.managerOrders.notPaid')}</span>
                    <PaymentToggle isChecked={isPaid} onChange={() => setIsPaid(!isPaid)} ariaLabel={t('pages.managerOrders.paid')} />
                </div>
            )}

            {isOpen && isPaid ? <Button onClick={() => undefined}>{t('pages.managerOrders.accept')}</Button> : null}
        </li>
    );
}

function ManagerOrders() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<OrderTab>('new');

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button type="button" className={styles.header__burger} aria-label={t('pages.managerOrders.menu')} />
                <div className={styles.header__avatar} />
            </header>

            <ul className={styles.list}>
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </ul>

            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button key={tab.name} type="button" className={`${styles.tabs__tab} ${activeTab === tab.name ? styles.tabs__tab_active : ''}`} onClick={() => setActiveTab(tab.name)}>
                        <span>{t(`pages.managerOrders.${tab.name}`)}</span>
                        {tab.count > 0 ? <span className={styles.tabs__count}>{tab.count}</span> : null}
                    </button>
                ))}
            </div>

            <nav className={styles.footer}>
                <Link to="/" className={styles.footer__item}>
                    <span className={`${styles.footer__icon} ${styles.footer__icon_home}`} />
                    <span className={styles.footer__label}>{t('pages.managerOrders.home')}</span>
                </Link>
                <Link to="/manager/orders" className={styles.footer__item}>
                    <span className={styles.footer__plus} />
                    <span className={`${styles.footer__label} ${styles.footer__label_active}`}>{t('pages.managerOrders.newOrder')}</span>
                </Link>
                <Link to="/manager/work-status" className={styles.footer__item}>
                    <span className={`${styles.footer__icon} ${styles.footer__icon_packages}`} />
                    <span className={styles.footer__label}>{t('pages.managerOrders.inStock')}</span>
                </Link>
            </nav>
        </div>
    );
}

export default ManagerOrders;
