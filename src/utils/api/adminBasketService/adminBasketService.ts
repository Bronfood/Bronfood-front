import { MealInBasket } from '../basketService/basketService';
import { Restaurant } from '../restaurantsService/restaurantsService';
import { AdminBasketServiceReal } from './adminBasketServiceReal';

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

export interface AdminBasketService {
    getAdminBasket: () => Promise<{ data: AdminBasket }>;
    emptyAdminBasket: (basketId: number) => Promise<void>;
    addAdminMeal: (mealId: number, restaurantId: number, features: { featureId: number; choiceId: number }[]) => Promise<{ data: MealForBasket }>;
    incrementAdminMeal: (basketMealId: number) => Promise<{ data: MealForBasket }>;
    decrementAdminMeal: (basketMealId: number) => Promise<{ data: MealForBasket | null }>;
}

export const adminBasketService = new AdminBasketServiceReal();
