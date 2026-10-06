import { useState } from 'react';
import { AdminOrder } from '../../../../utils/api/adminService/adminService';
import styles from './OrderCard.module.scss';
import PaymentToggle from '../PaymentToggle/PaymentToggle';

type OrderCardProps = {
    order: AdminOrder;
    onAccept: (orderId: number) => void;
};

function OrderCard({ order, onAccept }: OrderCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const totalPrice = order.meals.reduce((acc, current) => acc + current.count * current.meal.price, 0);

    const isPaid = order.status === 'paid';
    const isAccepted = order.status === 'accepted';
    const deliveryType = order.userName === 'Bronfood' ? 'Доставка' : 'Самовывоз';

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleAccept = () => {
        onAccept(order.id);
    };

    return (
        <li className={`${styles['order-card']} ${isOpen ? styles['order-card_open'] : ''}`}>
            <div className={styles['order-card__header']} onClick={handleToggle}>
                <div className={styles['order-card__top-row']}>
                    <span className={styles['order-card__code']}>{order.orderCode}</span>
                    <span className={styles['order-card__name']}>{order.userName}</span>
                    <span className={styles['order-card__delivery']}>{deliveryType}</span>
                    <span className={styles['order-card__price']}>{totalPrice} ₸</span>
                    <button className={`${styles['order-card__arrow']} ${isOpen ? styles['order-card__arrow_open'] : ''}`}>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1L6 6L11 1" stroke="#282828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {isOpen && (
                    <div className={styles['order-card__details']}>
                        <ul className={styles['order-card__items']}>
                            {order.meals.map((meal, index) => (
                                <li key={index} className={styles['order-card__item']}>
                                    <span className={styles['order-card__item-name']}>
                                        <span className={styles['order-card__bullet']} />
                                        {meal.meal.name}
                                        {meal.count > 1 && meal.count > 1 ? ` x${meal.count}` : ''}
                                    </span>
                                    <span className={styles['order-card__item-price']}>{meal.count * meal.meal.price} ₸</span>
                                </li>
                            ))}
                        </ul>

                        <div className={styles['order-card__payment-row']}>
                            <span className={styles['order-card__payment-text']}>{isPaid ? 'Оплачено' : 'Не оплачено'}</span>
                            <PaymentToggle isOn={isPaid} />
                        </div>

                        {isPaid && !isAccepted && (
                            <button className={styles['order-card__accept-btn']} onClick={handleAccept}>
                                Принять
                            </button>
                        )}

                        {isPaid && isAccepted && (
                            <div className={styles['order-card__accepted']}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M5 10L9 14L15 6" stroke="#70b26a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Принято</span>
                            </div>
                        )}

                        {order.userName === 'Bronfood' && isPaid && (
                            <div className={styles['order-card__marketplace']}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <rect x="2" y="4" width="16" height="12" rx="2" stroke="#70b26a" strokeWidth="1.5" />
                                    <path d="M6 10h8M10 6v8" stroke="#70b26a" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span>Оплачено маркетплейсом</span>
                            </div>
                        )}
                    </div>
                )}

                {!isOpen && (
                    <div className={styles['order-card__summary']}>
                        <p className={styles['order-card__summary-text']}>{order.meals.map((m) => m.meal.name).join(', ')}</p>
                        <div className={styles['order-card__payment-row']}>
                            <span className={styles['order-card__payment-text']}>{isPaid ? 'Оплачено' : 'Не оплачено'}</span>
                            <PaymentToggle isOn={isPaid} />
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
}

export default OrderCard;
