import { CateringMeal } from '../cateringMealService/cateringMealService';
import latte from './MockData/latte.jpg';
import doner from './MockData/doner.png';

export const meals: CateringMeal[] = [
    {
        id: 1,
        name: 'Куриный донер',
        description: 'Лаваш, курица, соленый огурец, помидор, капуста, лук, морковь, зелень.',
        photo: doner,
        base_price: 1050,
        waiting_time: '00:00:00',
        tags: [{ name: 'вега' }, { name: 'овощи' }],
        is_visible: true,
        category: {
            id: 1,
            name: 'Еда',
            photo: '',
        },
        features: [
            {
                id: 1,
                name: 'Дополнения',
                selection_type: 'single',
                pricing_strategy: 'add',
                choices: [
                    { id: 1, name: 'грибы', price: 40, is_visible: true, is_default: true },
                    { id: 2, name: 'лук', price: 40, is_visible: true, is_default: false },
                ],
            },
            {
                id: 2,
                name: 'Размер',
                selection_type: 'single',
                pricing_strategy: 'add',
                choices: [
                    { id: 1, name: '25 см', price: 50, is_visible: true, is_default: true },
                    { id: 2, name: '35 см', price: 100, is_visible: true, is_default: false },
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'Латте',
        description: 'Латте на кококосовм с пенкой.',
        photo: latte,
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
