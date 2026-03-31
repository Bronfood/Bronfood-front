import { handleFetch } from '../../serviceFuncs/handleFetch';
import { Category, CategoryService } from './categoryService';

export class CategoryServiceReal implements CategoryService {
    async getCategories(cateringId: number): Promise<{ data: Category[] }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/categories/`);
    }

    async getCategoryById(cateringId: number, categoryId: number): Promise<{ data: Category }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/categories/${categoryId}/`);
    }

    async createCategory(cateringId: number, data: Omit<Category, 'id'>): Promise<{ data: Category }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/categories/`, { method: 'POST', data });
    }

    async deleteCategory(cateringId: number, categoryId: number): Promise<{ success: boolean }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/categories/${categoryId}/`, { method: 'DELETE' });
    }

    async updateCategory(cateringId: number, data: Partial<Category> & { categoryId: number }): Promise<{ data: Category }> {
        const { categoryId, ...updateData } = data;
        return handleFetch(`api/dashboard/restaurants/${cateringId}/categories/${categoryId}/`, {
            method: 'PUT',
            data: updateData,
        });
    }
}
