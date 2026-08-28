import { CateringMeal } from '../cateringMealService/cateringMealService';
import { MockAdminService } from './adminService';
import { meals } from './MockAdminService';

export class AdminServiceMock implements MockAdminService {
    private meals: CateringMeal[] = meals;

    async getMealsStock(): Promise<{ data: CateringMeal[] }> {
        return await Promise.resolve({ data: this.meals });
    }
}
