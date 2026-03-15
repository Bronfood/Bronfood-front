//import { AdminServiceMock } from './adminServiceMock';
import { MealInBasket } from '../basketService/basketService';
import { Choice, Meal } from '../restaurantsService/restaurantsService';
import { AdminServiceReal } from './adminServiceReal';

export type ChoiceInAdminOrder = Omit<Choice, 'price' | 'default' | 'feature_name' | 'chosen'>;
export type MealInAdminOrder = Omit<Meal, 'description' | 'photo' | 'type' | 'hasFeatures' | 'category'>;
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

export interface AdminService {
    getAdminOrders: (status: AdminOrderStatus) => Promise<{ data: AdminOrder[] }>;
    changeAdminOrderStatus: (id: number, status: AdminOrderStatus) => Promise<void>;
}

// export const adminService = new AdminServiceMock();
export const adminService = new AdminServiceReal();
