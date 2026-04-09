import { CategoryServiceReal } from './categoryServiceReal';

export type Category = {
    /**
     * Category's id
     */
    id: number;
    /**
     * Category's name
     */
    name: string;
    /**
     * Category's photo
     */
    photo?: string;
    /**
     * Category's order
     */
    order?: number;
    /**
     * Category's meals
     */
    meal_ids?: number[];
};

export interface CategoryService {
    getCategories: (cateringId: number) => Promise<{ data: Category[] }>;
    getCategoryById: (cateringId: number, categoryId: number) => Promise<{ data: Category }>;
    createCategory: (cateringId: number, data: Omit<Category, 'id'>) => Promise<{ data: Category }>;
    deleteCategory: (cateringId: number, categoryId: number) => Promise<{ success: boolean }>;
    updateCategory: (cateringId: number, data: Partial<Category> & { categoryId: number }) => Promise<{ data: Category }>;
}

export const categoryService = new CategoryServiceReal();
