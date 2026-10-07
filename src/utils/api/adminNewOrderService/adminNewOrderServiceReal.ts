import { handleFetch } from '../../serviceFuncs/handleFetch';
import { CateringMeal } from '../cateringMealService/cateringMealService';
import { Feature } from '../restaurantsService/restaurantsService';
import { AdminBasket, AdminMeal, AdminNewOrder, AdminNewOrderPayload, AdminNewOrderService, MealForBasket, RegularClient } from './adminNewOrderService';

export class AdminNewOrderServiceReal implements AdminNewOrderService {
    async getAdminBasket(): Promise<{ data: AdminBasket }> {
        return handleFetch('api/restaurants/admin/basket/');
    }

    async emptyAdminBasket(basketId: number): Promise<void> {
        return handleFetch(`api/restaurants/admin/basket/${basketId}/`, { method: 'DELETE' });
    }

    async addMealAdminBasket(mealId: number, restaurantId: number, features: { featureId: number; choiceId: number }[]): Promise<{ data: MealForBasket }> {
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

    async incrementMealAdminBasket(mealId: number): Promise<void> {
        return handleFetch('api/restaurants/admin/basket/meals/increment/', { method: 'POST', data: { meal_id: mealId } });
    }

    async decrementMealAdminBasket(mealId: number): Promise<void> {
        return handleFetch('api/restaurants/admin/basket/meals/decrement/', { method: 'POST', data: { meal_id: mealId } });
    }

    async createAdminNewOrder(payload: AdminNewOrderPayload): Promise<{ data: AdminNewOrder }> {
        return handleFetch('api/restaurants/admin/orders/', { method: 'POST', data: payload });
    }

    async setAdminNewOrderPaid(orderId: number, isPaid: boolean): Promise<void> {
        return handleFetch(`/api/restaurants/admin/orders/${orderId}/paid/`, {
            method: 'PATCH',
            data: { is_paid: isPaid },
        });
    }

    async getAdminMeals(restaurantId: number): Promise<{ data: AdminMeal[] }> {
        return handleFetch(`api/restaurants/${restaurantId}/meals/`);
    }

    async getAdminFeatures(restaurantId: number, mealId: number): Promise<{ data: Feature[] }> {
        return handleFetch(`api/restaurants/${restaurantId}/meals/${mealId}/features/`);
    }

    async getAdminStockMeals(restaurantId: number): Promise<{ data: CateringMeal[] }> {
        return handleFetch(`api/restaurants/${restaurantId}/meals/`);
    }

    async getClientsByPhone(phone: string): Promise<{ data: RegularClient[] }> {
        return handleFetch(`api/restaurants/admin/client/?q=${phone}`);
    }

    async createRegularClient(data: Omit<RegularClient, 'id'>): Promise<{ data: RegularClient }> {
        return handleFetch('api/restaurants/admin/client/', { method: 'POST', data });
    }
}
