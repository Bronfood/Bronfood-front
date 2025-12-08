import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Preloader from '../../components/Preloader/Preloader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { useTranslation } from 'react-i18next';
import Popup from '../../components/Popups/Popup/Popup';
import { MyOrdersList, MyOrdersListEmpty } from './MyOrdersList/MyOrdersList';
import ConfirmationPopup from '../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import styles from './MyOrders.module.scss';
import { useCurrentUser } from '../../utils/hooks/useCurrentUser/useCurretUser';
import PopupOrderCancelled from '../PopupOrderCancelled/PopupOrderCancelled';
import { ORDERS_COUNT } from '../../utils/consts';
import { useOrderData, useUserOrders } from '../../utils/hooks/useOrder/useOrder';

const MyOrders: FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { currentUser } = useCurrentUser();
    const triggerRef = useRef<HTMLDivElement>(null);

    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [showOrderCancelledPopup, setShowOrderCancelledPopup] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserOrders(ORDERS_COUNT);
    const { setPreparationTime, setCancellationTime, cancelOrder } = useOrderData(currentUser?.id ?? null, null);

    const allOrders = data?.pages.flatMap((page) => page.results) || [];

    useEffect(() => {
        const triggerElement = triggerRef.current;
        if (!triggerElement || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) fetchNextPage();
            },
            { threshold: 0.1 }
        );

        observer.observe(triggerElement);

        return () => {
            observer.unobserve(triggerElement);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleConfirmCancelOrder = () => {
        if (orderToCancel !== null) {
            cancelOrder.mutate(orderToCancel.toString());

            setShowOrderCancelledPopup(true);
            setPreparationTime(0);
            setCancellationTime(0);
            setShowConfirmationPopup(false);
        }
    };

    const handleCancelOrder = (orderId: number) => {
        setOrderToCancel(orderId);
        setShowConfirmationPopup(true);
    };

    if (showOrderCancelledPopup) {
        return <PopupOrderCancelled />;
    }

    return (
        <>
            <Popup
                title={t('pages.order.title')}
                onClose={() => {
                    navigate('/');
                }}
            >
                {isLoading && <Preloader />}
                {error && <ErrorMessage message={error.message} />}
                {!isLoading && !error ? (
                    allOrders.length > 0 ? (
                        <>
                            <MyOrdersList orders={allOrders} onClickCancel={handleCancelOrder} />
                            {isFetchingNextPage && (
                                <div className={styles['preloader-wrapper']}>
                                    <Preloader />
                                </div>
                            )}
                            {hasNextPage && <div ref={triggerRef}></div>}
                        </>
                    ) : (
                        <MyOrdersListEmpty />
                    )
                ) : null}
            </Popup>
            {showConfirmationPopup && (
                <div className={styles['confirmation-popup-wrapper']}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToCancelTheOrder')} confirmButtonText={t('components.confirmationPopup.yes')} onCancel={() => setShowConfirmationPopup(false)} onSubmit={handleConfirmCancelOrder} />
                </div>
            )}
        </>
    );
};

export default MyOrders;
