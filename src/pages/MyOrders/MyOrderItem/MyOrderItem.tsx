import { FC } from 'react';
import styles from './MyOrderItem.module.scss';
import { useTranslation } from 'react-i18next';
import { UserOrder } from '../../../utils/api/orderService/orderService';
import { formatDateTime } from '../../../utils/serviceFuncs/formatDateTime';
import MyOrderMeal from './MyOrderMeal/MyOrderMeal';
import MyOrderTimer from './MyOrderTimer/MyOrderTimer';

type MyOrderItemProps = {
    order: UserOrder;
    onClickFeedback: () => void;
    showDetails: () => void;
    isShow: boolean;
    onClickCancel: (orderId: number) => void;
};

const MyOrderItem: FC<MyOrderItemProps> = ({ order, onClickFeedback, showDetails, isShow, onClickCancel }) => {
    const { t } = useTranslation();

    const isDetailInfo = (order.canceled_at || order.cancellation_reason || order.paid_at || order.issued_at || (order.paid_at && order.currency)) && order.status !== 'created';
    const canShowRepeatButton = order.is_order_repeatable;
    const canShowCancelButton = order.status === 'created' || order.status === 'paid';

    const getStatusColor = (status: string) => {
        if (['ready', 'completed'].includes(status)) return 'green';
        if (['unclaimed', 'cancelled_by_user', 'cancelled_by_admin', 'cancelled_by_timeout'].includes(status)) return 'red';
        return 'orange';
    };

    const cancelRepeatButtons = (
        <>
            <div className={styles['detail-info__container']}>
                {canShowCancelButton && (
                    <button className={styles['detail-info__repeat']} onClick={() => onClickCancel(order.id)}>
                        {t('pages.order.cancelOrder')}
                    </button>
                )}
            </div>
            {canShowCancelButton && <p className={styles['detail-info__not-repeat']}>{t('pages.order.canCancelOrderBeforeStartCooking')}</p>}
        </>
    );

    return (
        <li className={styles['card']}>
            <div className={styles['restaurant']}>
                <div className={styles['restaurant__image']} style={{ backgroundImage: `url(${order.restaurant.photo})` }} />
                <div className={styles['restaurant__description']}>
                    <div className={styles['restaurant__title_container']}>
                        <p className={styles['restaurant__title']}>{order.restaurant.name}</p>
                        <p className={styles['restaurant__rating']}>{order.restaurant.rating}</p>
                        <div className={`${styles['restaurant__icon']} ${styles['restaurant__icon_star']} ${styles['restaurant__icon_large']}`} />
                    </div>
                    <div className={styles['restaurant__feature']}>
                        <div className={`${styles['restaurant__icon']} ${styles['restaurant__icon_placemark']} ${styles['restaurant__icon_small']}`} />
                        <p className={styles['restaurant__feature_title']}>{order.restaurant.address}</p>
                    </div>
                </div>
            </div>

            <div className={styles['card__container-info']}>
                <div className={styles['card__code']}>
                    <p className={styles['card__code_text']}># {order.order_code}</p>
                    <p className={styles['card__date_text']}>{formatDateTime(order.created_at)}</p>
                </div>
                <p className={`${styles['card__status']} ${styles[`card__status--${getStatusColor(order.status)}`]}`}>{t(`pages.order.${order.status}`)}</p>
            </div>

            {order.status === 'accepted' && order.accepted_at && order.waiting_time ? (
                <div className={`${styles['waiting-time']}`}>
                    <p className={`${styles['waiting-time__title']}`}>{t('pages.order.waitingTime')}</p>
                    <div className={`${styles['waiting-time__container']}`}>
                        <div className={`${styles['waiting-time__image']}`}></div>
                        <MyOrderTimer startTime={order.accepted_at} waitingTime={order.waiting_time} />{' '}
                    </div>
                </div>
            ) : null}

            {order.status === 'created' && order.payment_url !== null ? (
                <div className={`${styles['payment']}`}>
                    <p className={`${styles['payment__title']}`}>{t('pages.order.paymentLink')}</p>
                    <a href={order.payment_url} target="_blank" className={`${styles['payment__link']}`}>
                        <div className={`${styles['payment__image']}`}></div>
                        <p className={`${styles['payment__text']}`}>{t('pages.order.proceedToPayment')}</p>
                    </a>
                </div>
            ) : null}

            {!order.rating && order.status === 'completed' ? (
                <div className={`${styles['feedback']}`}>
                    <p className={`${styles['feedback__title']}`}>{t('pages.order.howDoYouLikeTheOrder')}</p>
                    <div className={`${styles['feedback__container']}`} onClick={onClickFeedback}>
                        <div className={`${styles['feedback__image']}`}></div>
                        <p className={`${styles['feedback__text']}`}>{t('pages.order.feedback')}</p>
                    </div>
                </div>
            ) : null}

            {order.status === 'completed' && order.rating ? (
                <div className={`${styles['rating']}`}>
                    <p className={`${styles['rating__title']}`}>{t('pages.order.assignedRating')}</p>
                    <div className={`${styles['rating__container']}`}>
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className={`${styles['rating__image']} ${index < order.rating! ? styles['rating__image_orange'] : styles['rating__image_gray']}`}></div>
                        ))}
                    </div>
                </div>
            ) : null}

            <p className={styles['card__title']}>{t('pages.order.orderList')}</p>

            <article className={styles['order-item']}>
                <ul className={styles['order-item__list']}>
                    {order.meals.map((meal, index) => (
                        <MyOrderMeal meal={meal} key={index} />
                    ))}
                </ul>
            </article>

            <div className={styles['card__amount-container']}>
                <div className={styles['order-item__amount']}>
                    <p className={styles['order-item__title']}>
                        {order.amount}
                        <span>₸</span>
                    </p>
                </div>
                {isDetailInfo && (
                    <button onClick={showDetails} className={styles['card__button-info']}>
                        {isShow ? (
                            <div className={styles['card__button-container']}>
                                <p className={styles['card__button-container_text']}>{t('pages.order.buttonHide')}</p>
                                <div className={styles['card__button-container_image-hide']}></div>
                            </div>
                        ) : (
                            <div className={styles['card__button-container']}>
                                <p className={styles['card__button-container_text']}>{t('pages.order.buttonShow')}</p>
                                <div className={styles['card__button-container_image-show']}></div>
                            </div>
                        )}
                    </button>
                )}
            </div>

            {!isShow && canShowCancelButton && cancelRepeatButtons}

            <div className={styles['detail-info']}>
                {isShow && isDetailInfo && (
                    <>
                        <p className={styles['card__title']}>{t('pages.order.titleOrderInfo')}</p>
                        <div className={styles['detail-info__contant']}>
                            {order.canceled_at ? (
                                <div className={styles['detail-info__container']}>
                                    <p className={styles['detail-info__title']}>{t('pages.order.dateOfCanceled')}</p>
                                    <p className={styles['detail-info__text']}>{formatDateTime(order.canceled_at)}</p>
                                </div>
                            ) : null}
                            {order.cancellation_reason ? (
                                <div className={styles['detail-info__container']}>
                                    <p className={styles['detail-info__title']}>{t('pages.order.cancellationReason')}</p>
                                    <p className={styles['detail-info__text']}>{order.cancellation_reason}</p>
                                </div>
                            ) : null}
                            {order.paid_at ? (
                                <div className={styles['detail-info__container']}>
                                    <p className={styles['detail-info__title']}>{t('pages.order.paidFor')}</p>
                                    <p className={styles['detail-info__text']}>{formatDateTime(order.paid_at)}</p>
                                </div>
                            ) : null}
                            {order.issued_at ? (
                                <div className={styles['detail-info__container']}>
                                    <p className={styles['detail-info__title']}>{t('pages.order.dateOfIssue')}</p>
                                    <p className={styles['detail-info__text']}>{formatDateTime(order.issued_at)}</p>
                                </div>
                            ) : null}
                            {order.status !== 'created' && order.paid_at && order.currency ? (
                                <div className={styles['detail-info__container']}>
                                    <p className={styles['detail-info__title']}>{t('pages.order.currency')}</p>
                                    <p className={styles['detail-info__text']}>{order.currency}</p>
                                </div>
                            ) : null}
                        </div>
                    </>
                )}

                {isShow && (canShowRepeatButton || canShowCancelButton) && cancelRepeatButtons}
            </div>
        </li>
    );
};

export default MyOrderItem;
