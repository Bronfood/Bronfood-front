import { Category, DailyCategory, WeeklyMenu } from './cateringService';
import meal1 from './MockImages/meal1.png';
import drink1 from './MockImages/drink1.png';

export const emptyCategories: Category[] = [
    {
        id: 1,
        name: 'Еда',
        photo: meal1,
        meals: [],
    },
    {
        id: 2,
        name: 'Напиток',
        photo: drink1,
        meals: [],
    },
];

export const emptyDailyCategorys: DailyCategory[] = [
    {
        id: 1,
        name: 'Напиток',
        meals: [],
    },
    {
        id: 3,
        name: 'Второе',
        meals: [],
    },
];

export const emptyWeeklyMenu: WeeklyMenu[] = [
    {
        daily_categories: emptyDailyCategorys,
        weekday: 'monday',
    },
    {
        daily_categories: [],
        weekday: 'tuesday',
    },
    {
        daily_categories: [],
        weekday: 'wednesday',
    },
    {
        daily_categories: [],
        weekday: 'thursday',
    },
    {
        daily_categories: [],
        weekday: 'friday',
    },
    {
        daily_categories: [],
        weekday: 'saturday',
    },
    {
        daily_categories: [],
        weekday: 'sunday',
    },
];
