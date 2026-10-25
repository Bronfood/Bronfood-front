import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NewOrder.module.scss';
import ButtonIconSquare from '../../../components/ButtonIconSquare/ButtonIconSquare';
import Button from '../../../components/Button/Button';
import { useEmptyAdminBasket, useGetAdminBasket } from '../../../utils/hooks/useAdminBasket/useAdminBasket';
import { useCreateAdminOrder } from '../../../utils/hooks/useAdminOrders/useAdminOrders';
import { AdminNewOrderPayload } from '../../../utils/api/adminService/adminService';
import { useAdminOrderContext } from '../../../utils/hooks/useAdminOrders/useAdminOrderContext';
import { useCreateRegularClient } from '../../../utils/hooks/useAdminClient/useAdminClient';
import { useEffect, useRef, useState } from 'react';
import ConfirmationPopup from '../../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import Preloader from '../../../components/Preloader/Preloader';
import { getErrorMessage } from '../../../utils/serviceFuncs/getErrorMessage';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import { normalizePhone } from '../../../utils/serviceFuncs/formatPhoneNumber';
import { formatDuration } from '../../../utils/serviceFuncs/formatDuration';
import { formatScheduledFor } from '../../../utils/serviceFuncs/formatScheduledFor';

function NewOrder() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: basket, isLoading: isLoadingBasket, error: basketError } = useGetAdminBasket();
    const { mutateAsync: emptyBasket, isPending: isPendingEmptyBasket, error: emptyBasketError } = useEmptyAdminBasket();
    const { mutateAsync: createNewOrder, isPending: isPendingCreateNewOrder, error: createNewOrderError } = useCreateAdminOrder();
    const { mutateAsync: createRegularClient, isPending: isPendingCreateRegularClient, error: createRegularClientError } = useCreateRegularClient();
    const { clientData, timeData, cookMethod, preOrderType, clearNewOrderData } = useAdminOrderContext();

    const [showConfirmationPopupDeleteBasket, setShowConfirmationPopupDeleteBasket] = useState(false);
    const [showConfirmationPopupCloseCreateNewOrder, setShowConfirmationPopupCloseCreateNewOrder] = useState(false);

    const basketPrice = basket?.data?.basket_price;
    const hasMeals = (basket?.data?.meals.length ?? 0) > 0;
    const isBasketStep = location.pathname.endsWith('/basket-step');
    const isSubmitting = isPendingCreateNewOrder || isPendingCreateRegularClient;
    const shouldResetOnLeaveRef = useRef(false);
    const isBasketNotFound = (e: unknown) => getErrorMessage(e as Error, 'pages.admin.') === 'pages.admin.basketNotFound';

    const error = createNewOrderError || createRegularClientError || basketError || emptyBasketError;
    const errorMessage = error ? getErrorMessage(error, 'pages.admin.') : '';
    const is404 = errorMessage === 'pages.admin.basketNotFound';

    const emptyBasketAsync = async (): Promise<boolean> => {
        if (basketError && isBasketNotFound(basketError)) return true;

        const id = basket?.data?.id;
        if (id == null) return true;

        return emptyBasket(id)
            .then(() => true)
            .catch((e) => isBasketNotFound(e));
    };

    const handleEmptyBasketClick = () => {
        setShowConfirmationPopupDeleteBasket(true);
    };

    const handleConfirmEmptyBasket = async () => {
        const isEmptied = await emptyBasketAsync();
        setShowConfirmationPopupDeleteBasket(false);
        if (!isEmptied) return;
        navigate('/manager/new-order/meal-step');
    };

    const close = () => {
        setShowConfirmationPopupCloseCreateNewOrder(true);
    };

    const closeConfirm = async () => {
        const isEmptied = await emptyBasketAsync();
        setShowConfirmationPopupCloseCreateNewOrder(false);
        if (!isEmptied) return;
        shouldResetOnLeaveRef.current = true;
        navigate('/manager');
    };

    const handleSubmit = async () => {
        if (isSubmitting || !hasMeals) return;

        const fulfillment = clientData.fulfillment ?? 'pickup';
        const isDelivery = fulfillment === 'delivery';
        const phone = normalizePhone(clientData.user_phone);
        const name = clientData.user_name?.trim();

        let clientId = clientData.client_id;

        if (phone) {
            const clientResult = await createRegularClient({ data: { phone, ...(name ? { name } : {}) } }).catch(() => null);
            if (!clientResult) return;
            clientId = clientResult.data.id;
        }

        const payload: AdminNewOrderPayload = {
            client_id: clientId,
            fulfillment,
            is_paid: true,
            scheduled_for: fulfillment === 'dine_in' ? undefined : formatScheduledFor({ cookMethod, preOrderType, inTime: timeData.inTime, inTimeUnit: timeData.inTimeUnit, certainTime: timeData.certainTime }),
            delivery_duration: isDelivery ? formatDuration(clientData.delivery_duration, timeData.deliveryDurationUnit) : null,
            delivery: isDelivery
                ? {
                      street: clientData.delivery?.street?.trim() ?? '',
                      house: clientData.delivery?.house?.trim() ?? '',
                      apartment: clientData.delivery?.apartment?.trim() ?? '',
                      note: clientData.delivery?.note?.trim() ?? '',
                  }
                : undefined,
        };

        const orderResult = await createNewOrder({ payload }).catch(() => null);
        if (!orderResult) return;
        shouldResetOnLeaveRef.current = true;
        navigate('/manager/orders');
    };

    useEffect(() => {
        const isPopupOpen = showConfirmationPopupDeleteBasket || showConfirmationPopupCloseCreateNewOrder;
        document.body.style.overflow = isPopupOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showConfirmationPopupDeleteBasket, showConfirmationPopupCloseCreateNewOrder]);

    useEffect(() => {
        const resetRef = shouldResetOnLeaveRef;
        return () => {
            if (resetRef.current) {
                clearNewOrderData();
                resetRef.current = false;
            }
        };
    }, [clearNewOrderData]);

    return (
        <div className={styles['new-order']}>
            {(isLoadingBasket || isSubmitting) && <Preloader />}

            <h3 className={styles['new-order__title']}>{isBasketStep ? t('pages.admin.basket') : t('pages.admin.newOrder')}</h3>
            <div className={`${styles['new-order__button']} ${styles['new-order__button_close']}`}>{isBasketStep ? <ButtonIconSquare type="button" onClick={handleEmptyBasketClick} icon="delete" /> : <ButtonIconSquare type="button" onClick={close} icon="close" />}</div>

            {error && !is404 && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}

            <Outlet />

            {isBasketStep && hasMeals && basketPrice != null && (
                <div className={styles['new-order__footer']}>
                    <div className={styles['new-order__total']}>
                        <p>{t('pages.admin.total')}</p>
                        <p className={styles['new-order__total_price']}>{`${basketPrice} ₸`}</p>
                    </div>
                    <Button type="button" onClick={handleSubmit}>
                        {t('pages.admin.createOrderForPayment')} {basketPrice} ₸
                    </Button>
                </div>
            )}

            {showConfirmationPopupDeleteBasket && (
                <div className={styles['confirmation-popup-wrapper']}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToClearBasket')} confirmButtonText={t('components.confirmationPopup.clear')} onCancel={() => setShowConfirmationPopupDeleteBasket(false)} onSubmit={handleConfirmEmptyBasket} />
                    {isPendingEmptyBasket && (
                        <div className={styles['preloader-wrapper']}>
                            <Preloader />
                        </div>
                    )}
                </div>
            )}

            {showConfirmationPopupCloseCreateNewOrder && (
                <div className={styles['confirmation-popup-wrapper']}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToCloseOrderCreationPage')} confirmButtonText={t('components.confirmationPopup.yes')} onCancel={() => setShowConfirmationPopupCloseCreateNewOrder(false)} onSubmit={closeConfirm} />
                    {isPendingEmptyBasket && (
                        <div className={styles['preloader-wrapper']}>
                            <Preloader />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NewOrder;
