import { emptyCategories, emptyCaterings, emptyMeals, emptyWeeklyMenu, mockCateringService } from './MockCateringService';
import { CateringService, Administrator, Catering, CateringMeal, Category, DailyCategory, WeeklyMenu, Weekday } from './cateringService';

export class CateringServiceMock implements CateringService {
    private administrators: Administrator[] = mockCateringService;
    private caterings: Catering[] = emptyCaterings;
    private meals: CateringMeal[] = emptyMeals;
    private categories: Category[] = emptyCategories;
    private weeklyMenu: WeeklyMenu[] = emptyWeeklyMenu;

    async getAdministrators(): Promise<{ data: Administrator[] }> {
        const success = true;
        if (success) {
            return await Promise.resolve({ data: this.administrators });
        } else {
            return await Promise.reject(new Error('Error server'));
        }
    }

    async getAdministratorById(id: string): Promise<{ data: Administrator }> {
        const admin = this.administrators.find((a) => a.id === id);
        if (admin) {
            return await Promise.resolve({ data: admin });
        }
        return await Promise.reject(new Error('Error: administrator not found'));
    }

    async createAdministrator(data: Omit<Administrator, 'id'>): Promise<{ data: Administrator }> {
        const newAdministrator = {
            ...data,
            id: Date.now().toString(),
        };

        this.administrators.push(newAdministrator);
        return { data: newAdministrator };
    }

    async updateAdministrator(data: Partial<Administrator> & { id: string }): Promise<{ data: Administrator }> {
        const index = this.administrators.findIndex((a) => a.id === data.id);

        if (index !== -1) {
            this.administrators[index] = { ...this.administrators[index], ...data };
            return await Promise.resolve({ data: this.administrators[index] });
        } else {
            return await Promise.reject(new Error('Error server'));
        }
    }

    async deleteAdministrator(id: string): Promise<{ success: boolean }> {
        const index = this.administrators.findIndex((a) => a.id === id);

        if (index !== -1) {
            this.administrators.splice(index, 1);
            return await Promise.resolve({ success: true });
        } else {
            return await Promise.reject(new Error('Error: administrator not found'));
        }
    }

    async getCaterings(): Promise<{ data: Catering[] }> {
        const success = true;
        if (success) {
            return await Promise.resolve({ data: this.caterings });
        } else {
            return await Promise.reject(new Error('Error server'));
        }
    }

    async getCateringById(id: number): Promise<{ data: Catering }> {
        const numericId = Number(id);
        const catering = this.caterings.find((c) => c.id === numericId);
        if (catering) {
            return await Promise.resolve({ data: catering });
        }
        return await Promise.reject(new Error('Error: catering not found'));
    }

    async createCatering(data: Omit<Catering, 'id'>): Promise<{ data: Catering }> {
        const newCatering = {
            ...data,
            id: Date.now(),
        };

        this.caterings.push(newCatering);
        return { data: newCatering };
    }

    async deleteCatering(id: number): Promise<{ success: boolean }> {
        const numericId = Number(id);
        const index = this.caterings.findIndex((c) => c.id === numericId);

        if (index !== -1) {
            this.caterings.slice(index, 1);
            return await Promise.resolve({ success: true });
        } else {
            return await Promise.reject(new Error('Error: catering not found'));
        }
    }

    async updateCatering(data: Partial<Catering> & { id: number }): Promise<{ data: Catering }> {
        const numericId = Number(data.id);
        const index = this.caterings.findIndex((c) => c.id === numericId);

        if (index !== -1) {
            this.caterings[index] = { ...this.caterings[index], ...data };
            return await Promise.resolve({ data: this.caterings[index] });
        } else {
            return await Promise.reject(new Error('Error server'));
        }
    }

    async getMeals(): Promise<{ data: CateringMeal[] }> {
        const success = true;
        if (success) {
            return await Promise.resolve({ data: this.meals });
        } else {
            return await Promise.reject(new Error('Error server'));
        }
    }

    async createMeal(data: Omit<CateringMeal, 'id'>): Promise<{ data: CateringMeal }> {
        const newMeal = {
            ...data,
            id: Date.now(),
        };

        this.meals.push(newMeal);
        return { data: newMeal };
    }

    async deleteMeal(id: number): Promise<{ success: boolean }> {
        const index = this.meals.findIndex((m) => m.id === id);

        if (index !== -1) {
            this.meals.splice(index, 1);
            return await Promise.resolve({ success: true });
        } else {
            return await Promise.reject(new Error('Error: meal not found'));
        }
    }

    async getMealById(id: number): Promise<{ data: CateringMeal }> {
        const numericId = Number(id);
        const meal = this.meals.find((m) => m.id === numericId);
        if (meal) {
            return await Promise.resolve({ data: meal });
        }
        return await Promise.reject(new Error('Error: meal not found'));
    }

    async updateMeal(data: Partial<CateringMeal> & { id: number }): Promise<{ data: CateringMeal }> {
        const numericId = Number(data.id);
        const index = this.meals.findIndex((m) => m.id === numericId);

        if (index !== -1) {
            this.meals[index] = { ...this.meals[index], ...data };
            return await Promise.resolve({ data: this.meals[index] });
        } else {
            return await Promise.reject(new Error('Error server'));
        }
    }

    async getCategories(): Promise<{ data: Category[] }> {
        return await Promise.resolve({ data: this.categories });
    }

    async getCategoryById(id: number): Promise<{ data: Category }> {
        const numericId = Number(id);
        const category = this.categories.find((c) => c.id === numericId);

        if (category) {
            return await Promise.resolve({ data: category });
        }
        return await Promise.reject(new Error('Error: category not found'));
    }

    async createCategory(data: Omit<Category, 'id'>): Promise<{ data: Category }> {
        const newCategory = {
            ...data,
            id: Date.now(),
        };

        this.categories.push(newCategory);
        return { data: newCategory };
    }

    async getWeeklyMenu(): Promise<{ data: WeeklyMenu[] }> {
        return await Promise.resolve({ data: this.weeklyMenu });
    }

    async getWeeklyMenuByWeekday(weekday: string): Promise<{ data: WeeklyMenu }> {
        const menu = this.weeklyMenu.find((c) => c.weekday === weekday);

        if (menu) {
            return await Promise.resolve({ data: menu });
        }

        return {
            data: {
                weekday: weekday as Weekday,
                daily_categories: [],
            },
        };
    }

    async addCategoryToWeeklyMenu(weekday: Weekday, category: Omit<DailyCategory, 'id'>): Promise<{ data: WeeklyMenu }> {
        const menuIndex = this.weeklyMenu.findIndex((m) => m.weekday === weekday);
        const newDailyCategory = {
            ...category,
            id: Date.now(),
        };

        if (menuIndex === -1) {
            const newMenu: WeeklyMenu = {
                weekday,
                daily_categories: [newDailyCategory],
            };

            this.weeklyMenu.push(newMenu);
            return await Promise.resolve({ data: newMenu });
        } else {
            const menu = this.weeklyMenu[menuIndex];
            if (!menu.daily_categories) {
                menu.daily_categories = [];
            }

            menu.daily_categories.push(newDailyCategory);

            return await Promise.resolve({ data: menu });
        }
    }

    async deleteCategoryToWeeklyMenu(weekday: Weekday, dailyCategoryId: number): Promise<{ data: WeeklyMenu }> {
        const menuIndex = this.weeklyMenu.findIndex((w) => w.weekday === weekday);
        if (menuIndex === -1) {
            return Promise.reject(new Error(`Weekly menu for ${weekday} not found`));
        }

        const menu = this.weeklyMenu[menuIndex];
        if (!menu.daily_categories || menu.daily_categories.length === 0) {
            return Promise.reject(new Error(`No categories found for ${weekday}`));
        }

        const categoryIndex = menu.daily_categories.findIndex((c) => c.id === dailyCategoryId);

        if (categoryIndex !== -1) {
            menu.daily_categories?.splice(categoryIndex, 1);
            return await Promise.resolve({ data: menu });
        } else {
            return await Promise.reject(new Error('Error: category not found'));
        }
    }

    async updateCategoryToWeeklyMenu(weekday: Weekday, category: Partial<DailyCategory> & { id: number }): Promise<{ data: WeeklyMenu }> {
        const menuIndex = this.weeklyMenu.findIndex((w) => w.weekday === weekday);
        if (menuIndex === -1) {
            return Promise.reject(new Error(`Weekly menu for ${weekday} not found`));
        }

        const menu = this.weeklyMenu[menuIndex];
        if (!menu.daily_categories || menu.daily_categories.length === 0) {
            return Promise.reject(new Error(`No categories found for ${weekday}`));
        }

        const numericId = Number(category.id);
        const categoryIndex = menu.daily_categories.findIndex((c) => c.id === numericId);

        if (categoryIndex !== -1) {
            menu.daily_categories[categoryIndex] = { ...menu.daily_categories[categoryIndex], ...category };
            return await Promise.resolve({ data: this.weeklyMenu[menuIndex] });
        } else {
            return await Promise.reject(new Error('Error: category not found'));
        }
    }
}
