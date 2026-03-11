import { handleFetch } from '../../serviceFuncs/handleFetch';
import { handleFormDataFetch } from '../../serviceFuncs/handleFormDataFetch';
import { CateringMeal, CateringMealService } from './cateringMealService';

export class CateringMealServiceReal implements CateringMealService {
    async getCateringMeals(cateringId: number): Promise<{ data: CateringMeal[] }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/menu/`);
    }

    async getCateringMealById(cateringId: number, cateringMealId: number): Promise<{ data: CateringMeal }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/menu/${cateringMealId}/`);
    }

    async createCateringMeal(cateringId: number, data: FormData): Promise<{ data: CateringMeal }> {
        return handleFormDataFetch(`api/dashboard/restaurants/${cateringId}/menu/`, { method: 'POST', data });
    }

    async deleteCateringMeal(cateringId: number, cateringMealId: number): Promise<{ success: boolean }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/menu/${cateringMealId}/`, { method: 'DELETE' });
    }

    async updateCateringMeal(cateringId: number, cateringMealId: number, data: FormData): Promise<{ data: CateringMeal }> {
        return handleFormDataFetch(`api/dashboard/restaurants/${cateringId}/menu/${cateringMealId}/`, {
            method: 'PUT',
            data,
        });
    }
}
