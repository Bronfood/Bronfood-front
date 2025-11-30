import { OrderService, OrderState, UserOrdersListPagination } from './orderService';
import { handleFetch } from '../../serviceFuncs/handleFetch';

export class OrderServiceReal implements OrderService {
    async fetchOrderIdByUserId(userId: number): Promise<{ status: 'success'; data: { id: string }[] } | { status: 'error'; error_message: string }> {
        return handleFetch(`api/restaurants/orders/?clientId=${userId}`);
    }

    async fetchOrderedMealByOrderId(id: string): Promise<{ status: 'success'; data: OrderState[] } | { status: 'error'; error_message: string }> {
        return handleFetch(`api/restaurants/orders/?id=${id}`);
    }

    async getUserOrders(limit: number, offset: number): Promise<{ data: UserOrdersListPagination }> {
        return handleFetch(`api/restaurants/orders/?limit=${limit}&offset=${offset}`);
    }

    async cancelOrder(id: string): Promise<{ status: 'success'; data: void } | { status: 'error'; error_message: string }> {
        const options = {
            method: 'PATCH',
            data: { cancellationStatus: 'requested', isCancellationRequested: true },
        };
        return handleFetch(`api/restaurants/orders/${id}`, options);
    }

    async checkPreparationStatus(orderId: string): Promise<{ status: 'success'; data: { preparationStatus: 'confirmed' | 'waiting' | 'notConfirmed' }[] } | { status: 'error'; error_message: string }> {
        return handleFetch(`api/restaurants/orders?id=${orderId}`);
    }

    async submitOrderFeedback(restaurantId: number, orderId: number, rating: number, comment: string): Promise<{ status: 'success'; data: void } | { status: 'error'; error_message: string }> {
        const payload = {
            rating,
            order_id: orderId,
            ...(comment && { comment }),
        };
        const options = {
            method: 'POST',
            data: payload,
        };
        return handleFetch(`api/restaurants/${restaurantId}/reviews/`, options);
    }
}
