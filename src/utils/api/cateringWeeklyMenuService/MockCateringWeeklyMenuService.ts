import { DailyCategory, WeeklyMenu } from './cateringWeeklyMenuService';

export const emptyDailyCategorys: DailyCategory[] = [
    {
        id: 1,
        name: 'Напиток',
        meal_ids: [21],
    },
    {
        id: 3,
        name: 'Второе',
        meal_ids: [5, 19],
    },
    {
        id: 2,
        name: 'Десерт',
        meal_ids: [22],
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
