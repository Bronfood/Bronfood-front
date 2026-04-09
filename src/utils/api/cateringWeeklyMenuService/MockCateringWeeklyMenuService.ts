import { CateringMeal } from '../cateringMealService/cateringMealService';
import { DailyCategory, WeeklyMenu } from './cateringWeeklyMenuService';

export const emptyMeals: CateringMeal[] = [
    {
        id: 1,
        name: 'Куриный донер',
        description: 'Лаваш, курица, соленый огурец, помидор, капуста, лук, морковь, зелень.',
        photo: '',
        base_price: 1050,
        waiting_time: '00:00:00',
        tags: [{ name: 'вега' }, { name: 'овощи' }],
        is_visible: true,
        category: {
            id: 1,
            name: 'Еда',
            photo: '',
        },
    },
    {
        id: 2,
        name: 'Зеленый чай',
        description: 'Вкусный зеленый чай из Японии. Подается с медом.',
        photo: '',
        base_price: 200,
        waiting_time: '00:00:00',
        tags: [{ name: 'чай' }, { name: 'зеленый' }],
        is_visible: true,
    },
    {
        id: 3,
        name: 'Чизкейк',
        description: 'Слоеное пироженое с клубникой и конфитюром.',
        photo: '',
        base_price: 200,
        waiting_time: '00:00:00',
        tags: [{ name: 'сладкое' }, { name: 'десерт' }],
        is_visible: true,
    },
];

export const emptyDailyCategorys: DailyCategory[] = [
    {
        id: 1,
        name: 'Напиток',
        meals: emptyMeals,
    },
    {
        id: 3,
        name: 'Второе',
        meals: emptyMeals,
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
