import { Category } from '../categoryService/categoryService';
import { CateringMeal } from '../cateringMealService/cateringMealService';
import { Choice, Feature, Restaurant } from '../restaurantsService/restaurantsService';
import { AdminNewOrderServiceMock } from './adminNewOrderServiceMock';
import { AdminNewOrderServiceReal } from './adminNewOrderServiceReal';

export type Fulfillment = 'delivery' | 'pickup' | 'dine_in';
export type CookMethod = 'now' | 'preOrder' | 'deliveryTime' | 'certainTime';

export type AdminMeal = {
    /**
     * meal id
     */
    id: number;
    /**
     * meal name
     */
    name: string;
    /**
     * meal description
     */
    description?: string;
    /**
     * meal category
     */
    category?: Category;
    /**
     * meal waiting time
     */
    waiting_time: string;
    /**
     * meal photo
     */
    photo: string;
    /**
     * meal tags
     */
    tags?: { name: string }[];
    /**
     * meal price
     */
    price: number;
    /**
     * meal features
     */
    features?: Feature[];
    /**
     * meal hasFeatures
     */
    hasFeatures: boolean;
};

export type MealInBasket = {
    /**
     * meal in basket id
     */
    id: number;
    /**
     * meal
     */
    meal: AdminMeal;
    /**
     * quantity of meals
     */
    count: number;
    /**
     * meal choices
     */
    choices: Choice[];
    /**
     * meal price
     */
    price: number;
};

export type MealForBasket = MealInBasket & {
    /**
     * meal's is_deleted
     */
    is_deleted?: boolean;
    /**
     * meal's is_visible
     */
    is_visible?: boolean;
};

export type RegularClient = {
    /**
     * client id
     */
    id: number;
    /**
     * client name
     */
    name: string;
    /**
     * client phone
     */
    phone: string;
};

export type AdminBasket = {
    /**
     * basket id
     */
    id: number;
    /**
     * admin id
     */
    user: number;
    /**
     * restaurant
     */
    restaurant: Restaurant;
    /**
     * basket percentage
     */
    percentage: number;
    /**
     * basket price
     */
    basket_price: number;
    /**
     * basket commission
     */
    basket_commission: number;
    /**
     * basket meals
     */
    meals: MealInBasket[];
    /**
     * basket waiting time
     */
    basket_waiting_time: string;
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
    accepted_at: string;
    /**
     * new order ready at
     */
    ready_at: string;
    /**
     * new order closed at
     */
    closed_at: string;
    /**
     * new order issued at
     */
    issued_at: string;
    /**
     * new order cancelled at
     */
    cancelled_at: string;
    /**
     * new order paid at
     */
    paid_at: string;
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

export type AdminNewOrderClientData = {
    /**
     * new order client id
     */
    client_id?: number;
    /**
     * new order client fulfillment
     */
    fulfillment: Fulfillment;
    /**
     * new order client name
     */
    user_name?: string;
    /**
     * new order client phone
     */
    user_phone?: string;
    /**
     * new order client delivery data
     */
    delivery?: DeliveryData;
    /**
     * new order client delivery duration
     */
    delivery_duration?: string | null;
    /**
     * new order client scheduled for
     */
    scheduled_for?: string;
};

export interface AdminNewOrderService {
    getAdminBasket: () => Promise<{ data: AdminBasket }>;
    emptyAdminBasket: (basketId: number) => Promise<void>;
    addMealAdminBasket: (mealId: number, restaurantId: number, features: { featureId: number; choiceId: number }[]) => Promise<{ data: MealForBasket }>;
    incrementMealAdminBasket: (mealId: number) => Promise<void>;
    decrementMealAdminBasket: (mealId: number) => Promise<void>;

    createAdminNewOrder: (payload: AdminNewOrderPayload) => Promise<{ data: AdminNewOrder }>;
    setAdminNewOrderPaid: (orderId: number, isPaid: boolean) => Promise<void>;

    getAdminMeals: (restaurantId: number) => Promise<{ data: AdminMeal[] }>;
    getAdminFeatures: (restaurantId: number, mealId: number) => Promise<{ data: Feature[] }>;
    getAdminStockMeals: (restaurantId: number) => Promise<{ data: CateringMeal[] }>;

    getClientsByPhone: (phone: string) => Promise<{ data: RegularClient[] }>;
    createRegularClient: (data: Omit<RegularClient, 'id'>) => Promise<{ data: RegularClient }>;
}

export interface MockAdminNewOrderService {
    getAdminCategory: () => Promise<{ data: Category[] }>;
}

export const adminNewOrderService = new AdminNewOrderServiceReal();
export const adminNewOrderServiceMock = new AdminNewOrderServiceMock();
