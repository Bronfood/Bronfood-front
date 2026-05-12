import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPopup from '../AdminPopup/AdminPopup';
import OrdersTabs from './OrdersTabs/OrdersTabs';
import OrdersNotAccepted from './OrdersNotAccepted/OrdersNotAccepted';
import OrdersBeingPrepared from './OrdersBeingPrepared/OrdersBeingPrepared';
import OrdersArchive from './OrdersArchive/OrdersArchive';
import { useAdminOrdersMutations } from '../../../utils/hooks/useAdminOrders/useAdminOrders';
import AdminConfirmation from '../AdminConfirmation/AdminConfirmation';
import { AdminOrderStatus } from '../../../utils/api/adminService/adminService';

const tabNames: TabNames[] = ['notAccepted', 'beingPrepared', 'archive'];

export type TabNames = 'notAccepted' | 'beingPrepared' | 'archive';

export type OrderStatus = {
    id: number | null;
    status: AdminOrderStatus;
    confirmQuestion: string;
    isConfirmationPopupOpen: boolean;
};

function Orders() {
    const [tab, setTab] = useState<TabNames>('notAccepted');
    const [orderStatus, setOrderStatus] = useState<OrderStatus>({
        id: null,
        status: '',
        confirmQuestion: '',
        isConfirmationPopupOpen: false,
    });
    const navigate = useNavigate();
    const { changeAdminOrderStatus } = useAdminOrdersMutations();
    const close = () => {
        navigate('/manager');
    };
    const selectTab = (nextTab: TabNames) => setTab(nextTab);
    const onSubmit = async () => {
        await changeAdminOrderStatus.mutateAsync({ id: orderStatus.id as unknown as number, status: orderStatus.status });
        setOrderStatus({ ...orderStatus, isConfirmationPopupOpen: false });
    };
    return (
        <>
            <AdminPopup close={close} isConfirmationPopupOpen={orderStatus.isConfirmationPopupOpen}>
                <OrdersTabs tabNames={tabNames} tab={tab} selectTab={selectTab} />
                {tab === 'notAccepted' && <OrdersNotAccepted setOrderStatus={setOrderStatus} />}
                {tab === 'beingPrepared' && <OrdersBeingPrepared setOrderStatus={setOrderStatus} />}
                {tab === 'archive' && <OrdersArchive />}
            </AdminPopup>
            {orderStatus.isConfirmationPopupOpen && <AdminConfirmation close={() => setOrderStatus({ ...orderStatus, isConfirmationPopupOpen: false })} question={orderStatus.confirmQuestion} onSubmit={onSubmit} isLoading={changeAdminOrderStatus.isPending} />}
        </>
    );
}

export default Orders;
