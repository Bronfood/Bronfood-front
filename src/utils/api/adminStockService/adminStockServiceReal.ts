import { handleFetch } from '../../serviceFuncs/handleFetch';
import { AdminMealStock, AdminStockFilters, AdminStockService, MealChoice } from './adminStockService';

export class AdminStockServiceReal implements AdminStockService {
    async getAdminStockMeals(restaurantId: number, filters: AdminStockFilters = {}): Promise<{ data: AdminMealStock[] }> {
        const params = new URLSearchParams();
        if (filters.isVisible !== undefined) params.set('is_visible', String(filters.isVisible));
        if (filters.uncategorized) params.set('uncategorized', 'true');
        if (filters.categoryIds && filters.categoryIds.length > 0) params.set('category', filters.categoryIds.join(','));

        const query = params.toString();
        return handleFetch(`api/restaurants/${restaurantId}/admin/meals/${query ? `?${query}` : ''}`);
    }

    async setAdminStockMealVisibility(restaurantId: number, mealId: number, payload: Pick<AdminMealStock, 'is_visible'>): Promise<{ data: AdminMealStock }> {
        return handleFetch(`api/restaurants/${restaurantId}/admin/meals/${mealId}/`, {
            method: 'PATCH',
            data: payload,
        });
    }

    async setAdminStockMealChoiceVisibility(restaurantId: number, mealId: number, choiceId: number, payload: Pick<MealChoice, 'is_visible'>): Promise<{ data: MealChoice }> {
        return handleFetch(`api/restaurants/${restaurantId}/admin/meals/${mealId}/choices/${choiceId}/`, {
            method: 'PATCH',
            data: payload,
        });
    }
}
