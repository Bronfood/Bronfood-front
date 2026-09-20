import { Category } from '../categoryService/categoryService';
import { CateringMeal } from '../cateringMealService/cateringMealService';
import { AdminBasket, MockAdminService } from './adminService';
import { meals, basket, categories } from './MockAdminService';

export class AdminServiceMock implements MockAdminService {
    private meals: CateringMeal[] = meals;
    private basket: AdminBasket = basket;
    private categories: Category[] = categories;

    async getMealsStock(): Promise<{ data: CateringMeal[] }> {
        return await Promise.resolve({ data: this.meals });
    }

    async getFoodForOrder(): Promise<{ data: CateringMeal[] }> {
        return await Promise.resolve({ data: this.meals });
    }

    async getAdminBasket(): Promise<{ data: AdminBasket }> {
        return await Promise.resolve({ data: this.basket });
    }

    async deleteMealInBasket(mealId: number): Promise<{ data: AdminBasket }> {
        const newBasket: AdminBasket = {
            ...this.basket,
            meals: this.basket.meals.filter((meal) => meal.id !== mealId),
        };

        this.basket = newBasket;

        return await Promise.resolve({ data: newBasket });
    }

    async getAdminCategory(): Promise<{ data: Category[] }> {
        return await Promise.resolve({ data: this.categories });
    }
}
