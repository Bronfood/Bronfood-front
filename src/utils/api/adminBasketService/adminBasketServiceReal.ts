import { handleFetch } from '../../serviceFuncs/handleFetch';
import { AdminBasket, AdminBasketService, MealForBasket } from './adminBasketService';

export class AdminBasketServiceReal implements AdminBasketService {
    async getAdminBasket(): Promise<{ data: AdminBasket }> {
        return handleFetch('api/restaurants/admin/basket/');
    }

    async emptyAdminBasket(basketId: number): Promise<void> {
        return handleFetch(`api/restaurants/admin/basket/${basketId}/`, { method: 'DELETE' });
    }

    async addAdminMeal(mealId: number, restaurantId: number, features: { featureId: number; choiceId: number }[]): Promise<{ data: MealForBasket }> {
        return handleFetch('api/restaurants/admin/basket/meals/', {
            method: 'POST',
            data: {
                meal_id: mealId,
                restaurant_id: restaurantId,
                features: features.map(({ featureId, choiceId }) => ({
                    feature_id: featureId,
                    choice_id: choiceId,
                })),
            },
        });
    }

    async incrementAdminMeal(basketMealId: number): Promise<{ data: MealForBasket }> {
        return handleFetch('api/restaurants/admin/basket/meals/increment/', { method: 'POST', data: { meal_id: basketMealId } });
    }

    async decrementAdminMeal(basketMealId: number): Promise<{ data: MealForBasket | null }> {
        const result = await handleFetch('api/restaurants/admin/basket/meals/decrement/', { method: 'POST', data: { meal_id: basketMealId } });
        if (result instanceof Response) {
            return { data: null };
        }
        return result;
    }
}
