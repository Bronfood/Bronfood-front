import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NewOrder.module.scss';
import ButtonIconSquare from '../../../components/ButtonIconSquare/ButtonIconSquare';
import Button from '../../../components/Button/Button';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useEmptyAdminBasket, useGetAdminBasket } from '../../../utils/hooks/useAdminBasket/useAdminBasket';
import { useCreateAdminOrder } from '../../../utils/hooks/useAdminOrders/useAdminOrders';
import { AdminNewOrderPayload } from '../../../utils/api/adminService/adminService';
import { useAdminOrderContext } from '../../../utils/hooks/useAdminOrders/useAdminOrderContext';
import { useCreateRegularClient } from '../../../utils/hooks/useAdminClient/useAdminClient';

function NewOrder() {
    const { data: basket } = useGetAdminBasket();
    const { mutateAsync: emptyBasket } = useEmptyAdminBasket();
    const { mutateAsync: createNewOrder } = useCreateAdminOrder();
    const { mutateAsync: createRegularClient } = useCreateRegularClient();
    const { clientData, clearClientData } = useAdminOrderContext();

    const location = useLocation();
    const basketId = basket?.data?.id;
    const basketPrice = basket?.data?.basket_price;
    const isBasketStep = location.pathname.endsWith('/basket-step');

    const handleEmptyBasket = async () => {
        if (basketId == null) return;
        await emptyBasket(basketId);
    };

    const { t } = useTranslation();
    const navigate = useNavigate();

    const close = (path: string) => {
        handleEmptyBasket();
        clearClientData();
        navigate(path);
    };

    const clickEmptyBasket = async () => {
        await handleEmptyBasket();
        navigate('/manager/new-order/meal-step');
    };

    const handleSubmit: SubmitHandler<FieldValues> = async () => {
        const phone = clientData.user_phone?.trim();
        const name = clientData.user_name?.trim();

        let clientId = clientData.client_id ?? undefined;

        if (phone) {
            const { data: client } = await createRegularClient({
                data: {
                    name: name ?? '',
                    phone,
                },
            });
            clientId = client.id;
        }

        const payload: AdminNewOrderPayload = {
            client_id: clientId,
            fulfillment: clientData.fulfillment ?? 'pickup',
            is_paid: false,
            delivery_duration: clientData.delivery_duration ?? null,
            delivery:
                clientData.fulfillment === 'delivery'
                    ? {
                          street: clientData.delivery?.street ?? '',
                          house: clientData.delivery?.house ?? '',
                          apartment: clientData.delivery?.apartment ?? '',
                          note: clientData.delivery?.note ?? '',
                      }
                    : undefined,
        };

        await createNewOrder({ payload });
        close('/manager/orders');
    };

    return (
        <div className={styles['new-order']}>
            <h3 className={styles['new-order__title']}>{isBasketStep ? t('pages.admin.basket') : t('pages.admin.newOrder')}</h3>
            <div className={`${styles['new-order__button']} ${styles['new-order__button_close']}`}>{isBasketStep ? <ButtonIconSquare type="button" onClick={clickEmptyBasket} icon="delete" /> : <ButtonIconSquare type="button" onClick={() => close('/manager')} icon="close" />}</div>
            <Outlet />
            {isBasketStep && basketPrice != null && (
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
        </div>
    );
}

export default NewOrder;
