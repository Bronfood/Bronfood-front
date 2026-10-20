import { MealInBasket } from '../basketService/basketService';
import { Category } from '../categoryService/categoryService';
import { Choice, Meal } from '../restaurantsService/restaurantsService';
import { AdminServiceReal } from './adminServiceReal';

export type ChoiceInAdminOrder = Omit<Choice, 'price' | 'default' | 'feature_name' | 'chosen'>;
export type MealInAdminOrder = Omit<Meal, 'description' | 'photo' | 'type' | 'hasFeatures' | 'category'>;
export type Fulfillment = 'delivery' | 'pickup' | 'dine_in';
export type CookMethod = 'now' | 'preOrder';
export type PreOrderType = 'inTime' | 'certainTime';
export type DurationUnit = 'min' | 'hour';
export type MealInOrder = Omit<MealInBasket, 'meal' | 'choices'> & {
    meal: MealInAdminOrder;
    choices: ChoiceInAdminOrder[];
};
export type AdminOrderStatus = 'paid' | 'accepted' | 'ready' | 'cancel' | 'completed' | 'archive' | '';
export type AdminOrder = {
    /**
     * order's id
     */
    id: number;
    /**
     * user's name
     */
    userName: string;
    /**
     * order's code
     */
    orderCode: string;
    /**
     * meals in order
     */
    meals: MealInOrder[];
    /**
     * time order was accepted
     */
    acceptedAt: Date | '';
    /**
     * time order was ready for pick-up
     */
    readyAt: Date | '';
    /**
     * time order was picked up by user
     */
    issuedAt: Date | '';
    /**
     * time order was canceled by admin
     */
    cancelledAt: Date | '';
    /**
     * order's current status
     */
    status: AdminOrderStatus;
    /**
     * time required for order to be ready
     */
    waitingTime: number;
};
export type MealInAdminOrderFromApi = Omit<MealInAdminOrder, 'waitingTime'> & { waiting_time: number };
export type MealInOrderFromApi = Omit<MealInOrder, 'meal'> & {
    meal: MealInAdminOrderFromApi;
};
export type AdminOrderFromApi = Omit<AdminOrder, 'waitingTime' | 'meals'> & { waiting_time: number; meals: MealInOrderFromApi[] };

export type Schedule = {
    id: number;
    date: string;
    open_time: string | null;
    close_time: string | null;
    source: string;
};

export type DeliveryData = {
    /**
     * delivery street
     */
    street: string;
    /**
     * delivery street
     */
    house: string;
    /**
     * delivery street
     */
    apartment: string;
    /**
     * delivery street
     */
    note?: string;
};

export type AdminNewOrderPayload = {
    /**
     * new order payload client id
     */
    client_id?: number;
    /**
     * new order payload fulfillment
     */
    fulfillment: Fulfillment;
    /**
     * new order payload paided
     */
    is_paid: boolean;
    /**
     * new order payload scheduled for
     */
    scheduled_for?: string;
    /**
     * new order payload delivery duration
     */
    delivery_duration?: string | null;
    /**
     * new order payload delivery data
     */
    delivery?: DeliveryData;
};

export type AdminNewOrderClientData = Omit<AdminNewOrderPayload, 'is_paid'> & {
    /**
     * new order client name
     */
    user_name?: string;
    /**
     * new order client phone
     */
    user_phone?: string;
};

/* export type AdminNewOrder = Omit<AdminOrder, 'is_paid' | 'meals' | 'waitingTime' | 'acceptedAt' | 'readyAt' | 'issuedAt' | 'cancelledAt'> & {
    user_phone?: string;
    meals: MealInBasket[];
    currency: string;
    waiting_time: string;
    cancellation_reason: string | null;
    closed_at: Date | '';
    paid_at: Date | '';
    accepted_at: Date | '';
    ready_at: Date | '';
    issued_at: Date | '';
    cancelled_at: Date | '';
    scheduled_for?: string;
    fulfillment: Fulfillment;
    delivery_duration: string | null;
    source: string;
    created_by: string;
} */

export type AdminNewOrder = {
    /**
     * new order id
     */
    id: number;
    /**
     * new order client name
     */
    user_name?: string;
    /**
     * new order client phone
     */
    user_phone?: string;
    /**
     * new order code
     */
    order_code: string;
    /**
     * new order meals
     */
    meals: MealInBasket[];
    /**
     * new order currency
     */
    currency: string;
    /**
     * new order status
     */
    status: string;
    /**
     * new order waiting time
     */
    waiting_time: string;
    /**
     * new order cancellation reason
     */
    cancellation_reason: string | null;
    /**
     * new order accepted at
     */
    accepted_at: Date | '';
    /**
     * new order ready at
     */
    ready_at: Date | '';
    /**
     * new order closed at
     */
    closed_at: Date | '';
    /**
     * new order issued at
     */
    issued_at: Date | '';
    /**
     * new order cancelled at
     */
    cancelled_at: Date | '';
    /**
     * new order paid at
     */
    paid_at: Date | '';
    /**
     * new order scheduled for
     */
    scheduled_for?: string;
    /**
     * new order fulfillment
     */
    fulfillment: Fulfillment;
    /**
     * new order delivery duration
     */
    delivery_duration: string | null;
    /**
     * new order source
     */
    source: string;
    /**
     * new order created by
     */
    created_by: string;
};

export interface AdminService {
    getAdminOrders: (status: AdminOrderStatus) => Promise<{ data: AdminOrder[] }>;
    changeAdminOrderStatus: (id: number, status: AdminOrderStatus) => Promise<void>;
    createAdminOrder: (payload: AdminNewOrderPayload) => Promise<{ data: AdminNewOrder }>;

    getAdminSchedules: (start: Date, end: Date) => Promise<{ data: Schedule[] }>;
    addSchedule: (date: Date | undefined, openTime: string | null, closeTime: string | null) => Promise<{ data: Schedule }>;
    deleteSchedule: (id: number) => Promise<{ data: Schedule }>;

    getAdminCategories: (restaurantId: number) => Promise<{ data: Category[] }>;
}

export const adminService = new AdminServiceReal();
