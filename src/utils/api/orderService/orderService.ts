import { Meal } from '../restaurantsService/restaurantsService';
import { OrderServiceReal } from './orderServiceReal';

export interface OrderedMeal {
    /**
     * Ordered Meal type, representing the details of the meal ordered.
     */
    orderedMeal: Meal;
    /**
     * Number of units of the item ordered.
     */
    quantity: number;
}

export interface OrderState {
    /**
     * id for the user who made the order.
     */
    userId: number;
    /**
     * Unique identifier for the client who made the order.
     */
    id: string;
    /**
     * Total amount of the order in the local currency.
     */
    totalAmount: number;
    /**
     * Confirmation status of the order.
     */
    preparationStatus: 'waiting' | 'confirmed' | 'notConfirmed';
    /**
     * Time required to prepare the order, measured in minutes.
     */
    preparationTime: number;
    /**
     * Payment status of the order.
     */
    paymentStatus: 'paid' | 'notPaid';
    /**
     * Review status of the order.
     */
    reviewStatus: 'waiting' | 'reviewed' | 'skipped';
    /**
     * Time of order cancellation in seconds.
     */
    cancellationTime: number;
    /**
     * Cancellation status of the order.
     */
    cancellationStatus: 'none' | 'requested' | 'confirmed';
    /**
     * Flag indicating whether a cancellation was requested for the order.
     */
    isCancellationRequested: boolean;
    /**
     * Array with details of items in the order.
     */
    orderedMeal: OrderedMeal[];
    /**
     * Provides restaurantId for order feedback
     */
    restaurantId: number;
}

export interface MealChoice {
    /**
     * Choice's id
     */
    id: number;
    /**
     * Choice's name
     */
    name: string;
}

export interface UserOrderMeal {
    /**
     * Meal's id
     */
    id: number;
    /**
     * Meal's name
     */
    name: string;
    /**
     * Meal's count
     */
    count: number;
    /**
     * Meal's price
     */
    price: number;
    /**
     * Meal's choices arrey
     */
    choices: MealChoice[];
    /**
     * Meal's available
     */
    is_available: boolean;
}

export interface UserOrder {
    /**
     * Order's id
     */
    id: number;
    /**
     * Order's code
     */
    order_code: string | null;
    /**
     * Order's amount
     */
    amount: number;
    /**
     * Order's currency
     */
    currency: string;
    /**
     * Order's status
     */
    status: string;
    /**
     * Order's restaurant
     */
    restaurant: {
        id: number;
        photo: string;
        name: string;
        rating: number;
        address: string;
    };
    /**
     * Order's meals arrey
     */
    meals: UserOrderMeal[];
    /**
     * Order's created date
     */
    created_at: string;
    /**
     * Order's paid date
     */
    paid_at?: string | null;
    /**
     * Order's waiting time
     */
    waiting_time: string;
    /**
     * Order's canceled date
     */
    canceled_at?: string | null;
    /**
     * Order's canceled reason
     */
    cancellation_reason?: string | null;
    /**
     * Order's issued date
     */
    issued_at?: string | null;
    /**
     * Order's accepted
     */
    accepted_at: string | null;
    /**
     * Order's rating
     */
    rating?: number | null;
    /**
     * Order's payment link
     */
    payment_url?: string | null;
    /**
     * Order's repeatable
     */
    is_order_repeatable: boolean;
}

export interface UserOrdersListPagination {
    /**
     * Count order's
     */
    count: number;
    /**
     * Next page link
     */
    next: string | null;
    /**
     * Previous page link
     */
    previous: string | null;
    /**
     * Results order's arrey
     */
    results: UserOrder[];
}

export interface OrderService {
    fetchOrderIdByUserId: (userId: number) => Promise<{ status: 'success'; data: { id: string }[] } | { status: 'error'; error_message: string }>;
    fetchOrderedMealByOrderId: (id: string) => Promise<{ status: 'success'; data: OrderState[] } | { status: 'error'; error_message: string }>;
    getUserOrders: (limit: number, offset: number) => Promise<{ data: UserOrdersListPagination }>;
    cancelOrder: (id: string) => Promise<{ status: 'success'; data: void } | { status: 'error'; error_message: string }>;
    checkPreparationStatus: (orderId: string) => Promise<{ status: 'success'; data: { preparationStatus: 'confirmed' | 'waiting' | 'notConfirmed' }[] } | { status: 'error'; error_message: string }>;
    submitOrderFeedback: (restaurantId: number, orderId: number, rating: number, comment: string) => Promise<{ status: 'success'; data: void } | { status: 'error'; error_message: string }>;
}

export const orderService = new OrderServiceReal();
