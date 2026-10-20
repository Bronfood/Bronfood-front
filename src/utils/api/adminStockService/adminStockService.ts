import { Choice, Meal } from '../restaurantsService/restaurantsService';
import { AdminStockServiceReal } from './adminStockServiceReal';

export type MealChoice = Choice & {
    /**
     * Choice is_visible
     */
    is_visible: boolean;
    /**
     * Choice is_deleted
     */
    is_deleted: boolean;
};

export type MealFeature = {
    /**
     * Feature id
     */
    id: number;
    /**
     * Feature name
     */
    name: string;
    /**
     * Feature choices
     */
    choices: MealChoice[];
};

export type AdminMealStock = Omit<Meal, 'waitingTime'> & {
    /**
     * Meal waiting time
     */
    waiting_time: string;
    /**
     * Meal tags
     */
    tags?: { name: string }[];
    /**
     * Meal features
     */
    features?: MealFeature[];
    /**
     * Meal is_visible
     */
    is_visible: boolean;
};

export type AdminStockFilters = {
    /**
     * true / false
     */
    isVisible?: boolean;
    uncategorized?: boolean;
    categoryIds?: number[];
};

export interface AdminStockService {
    getAdminStockMeals: (restaurantId: number, filters?: AdminStockFilters) => Promise<{ data: AdminMealStock[] }>;
    setAdminStockMealVisibility: (restaurantId: number, mealId: number, payload: Pick<AdminMealStock, 'is_visible'>) => Promise<{ data: AdminMealStock }>;
    setAdminStockMealChoiceVisibility: (restaurantId: number, mealId: number, choiceId: number, payload: Pick<MealChoice, 'is_visible'>) => Promise<{ data: MealChoice }>;
}

export const adminStockService = new AdminStockServiceReal();
