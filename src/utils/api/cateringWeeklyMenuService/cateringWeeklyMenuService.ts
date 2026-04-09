import { CateringMeal } from '../cateringMealService/cateringMealService';
import { CateringWeeklyMenuServiceMock } from './cateringWeeklyMenuServiceMock';

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type DailyCategory = {
    /**
     * Category's id
     */
    id: number;
    /**
     * Category's name
     */
    name: string;
    /**
     * Category's meals
     */
    meals?: CateringMeal[];
};

export type WeeklyMenu = {
    daily_categories?: DailyCategory[];
    weekday: Weekday;
};

export interface CateringWeeklyMenuService {
    getWeeklyMenu: () => Promise<{ data: WeeklyMenu[] }>;
    getWeeklyMenuByWeekday: (weekday: string) => Promise<{ data: WeeklyMenu }>;
    addCategoryToWeeklyMenu: (weekday: Weekday, category: Omit<DailyCategory, 'id'>) => Promise<{ data: WeeklyMenu }>;
    deleteCategoryToWeeklyMenu: (weekday: Weekday, dailyCategoryId: number) => Promise<{ data: WeeklyMenu }>;
    updateCategoryToWeeklyMenu: (weekday: Weekday, category: Partial<DailyCategory> & { id: number }) => Promise<{ data: WeeklyMenu }>;
}

export const cateringWeeklyMenuServiceMock = new CateringWeeklyMenuServiceMock();
