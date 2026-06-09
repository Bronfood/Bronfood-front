import { CateringWeeklyMenuService, DailyCategory, Weekday, WeeklyMenu } from './cateringWeeklyMenuService';
import { emptyWeeklyMenu } from './MockCateringWeeklyMenuService';

export class CateringWeeklyMenuServiceMock implements CateringWeeklyMenuService {
    private weeklyMenu: WeeklyMenu[] = emptyWeeklyMenu;

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

        const updatedMenu: WeeklyMenu = {
            ...menu,
            daily_categories: menu.daily_categories.filter((c) => c.id !== dailyCategoryId),
        };

        this.weeklyMenu = this.weeklyMenu.map((m, i) => (i === menuIndex ? updatedMenu : m));

        return Promise.resolve({ data: updatedMenu });
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

        if (categoryIndex === -1) {
            return Promise.reject(new Error('Error: category not found'));
        }

        const updatedMenu: WeeklyMenu = {
            ...menu,
            daily_categories: menu.daily_categories.map((c) => (c.id === numericId ? { ...c, ...category } : c)),
        };

        this.weeklyMenu = this.weeklyMenu.map((m, i) => (i === menuIndex ? updatedMenu : m));

        return Promise.resolve({ data: updatedMenu });
    }
}
