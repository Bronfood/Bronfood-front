import { Administrator, Category, Catering, CateringMeal } from './cateringService';
import restaurant1 from './MockImages/restaurant1.png';
import restaurant2 from './MockImages/restaurant2.png';
import restaurant3 from './MockImages/restaurant3.png';
import meal1 from './MockImages/meal1.png';
import meal2 from './MockImages/meal2.jpg';
import meal3 from './MockImages/meal3.jpg';
import drink1 from './MockImages/drink1.png';
import dessert1 from './MockImages/dessert1.png';

export const emptyCaterings: Catering[] = [
    {
        id: 1,
        photo: restaurant1,
        name: 'Jahu',
        description: 'Самые вкусные донеры и кофе',
        rating: 4.7,
        address: 'Казахстан, Астана, улица Бухар Жырау, 34/2',
        coordinates: { latitude: 51.09835783805425, longitude: 71.43399606766961 },
        tags: [{ name: 'каппучино' }, { name: 'свежый салат' }, { name: 'бистро' }],
        workingTime: {
            schedule: [
                { weekday: 0, open_time: '08:00', close_time: '23:00' },
                { weekday: 1, open_time: '08:00', close_time: '20:00' },
                { weekday: 2, open_time: '08:00', close_time: '20:00' },
                { weekday: 3, open_time: '08:00', close_time: '20:00' },
                { weekday: 4, open_time: '08:00', close_time: '22:00' },
                { weekday: 5, open_time: '08:00', close_time: '22:00' },
                { weekday: 6, open_time: '10:00', close_time: '18:00' },
            ],
            is24h: false,
        },
        type: 'cafe',
        cancellationTime: 7,
        categories: [
            {
                id: 1,
                name: 'Еда',
                photo: meal1,
            },
            {
                id: 2,
                name: 'Напиток',
                photo: drink1,
            },
            {
                id: 3,
                name: 'Десерт',
                photo: dessert1,
            },
        ],
    },
    {
        id: 2,
        photo: restaurant2,
        name: 'Boom',
        description: 'Самые вкусные донеры и кофе',
        rating: 4.8,
        address: 'Казахстан, Астана, ул. Сыгынак, 60/3',
        coordinates: { latitude: 0, longitude: 0 },
        tags: [{ name: 'вкусно' }, { name: 'дешево' }, { name: 'сердито' }],
        workingTime: {
            schedule: [
                { weekday: 0, open_time: '08:00', close_time: '23:00' },
                { weekday: 1, open_time: '08:00', close_time: '20:00' },
                { weekday: 2, open_time: '08:00', close_time: '20:00' },
                { weekday: 3, open_time: '08:00', close_time: '20:00' },
                { weekday: 4, open_time: '08:00', close_time: '22:00' },
                { weekday: 5, open_time: '08:00', close_time: '22:00' },
                { weekday: 6, open_time: null, close_time: null },
            ],
            is24h: false,
        },
        type: 'fastFood',
        cancellationTime: 7,
    },
    {
        id: 4,
        photo: restaurant3,
        name: 'Moon',
        description: 'Необычные цветные бургеры и сочная пицца',
        rating: 4.8,
        address: 'Казахстан, Астана, ул. Акмешит, д 19А',
        coordinates: { latitude: 51.095427, longitude: 71.415832 },
        tags: [{ name: 'сок' }, { name: 'соус' }, { name: 'оладьи' }],
        workingTime: {
            schedule: [
                { weekday: 0, open_time: '07:00', close_time: '23:00' },
                { weekday: 1, open_time: '08:00', close_time: '11:00' },
                { weekday: 2, open_time: '08:00', close_time: '20:00' },
                { weekday: 3, open_time: '08:00', close_time: '20:00' },
                { weekday: 4, open_time: '08:00', close_time: '22:00' },
                { weekday: 5, open_time: '08:00', close_time: '22:00' },
                { weekday: 6, open_time: null, close_time: null },
            ],
            is24h: false,
        },
        type: 'cafeBar',
        cancellationTime: 5,
    },
];

export const emptyCatering: Catering = {
    id: 2,
    photo: restaurant3,
    name: 'Boom',
    description: 'Самые вкусные донеры и кофе',
    rating: 4.8,
    address: 'Казахстан, Астана, улица Бухар Жырау, 34/2',
    coordinates: { latitude: 51.09835783805425, longitude: 71.43399606766961 },
    tags: [{ name: 'веган' }, { name: 'органичное' }, { name: 'кофе' }],
    workingTime: {
        schedule: [
            { weekday: 0, open_time: '08:00', close_time: '23:00' },
            { weekday: 1, open_time: '08:00', close_time: '20:00' },
            { weekday: 2, open_time: '08:00', close_time: '20:00' },
            { weekday: 3, open_time: '08:00', close_time: '20:00' },
            { weekday: 4, open_time: '08:00', close_time: '22:00' },
            { weekday: 5, open_time: '08:00', close_time: '22:00' },
            { weekday: 6, open_time: '10:00', close_time: '18:00' },
        ],
        is24h: false,
    },
    type: 'fastFood',
    cancellationTime: 7,
};

export const mockCateringService: Administrator[] = [
    {
        id: '1',
        login: 'Jahu',
        password: '12345',
        catering: emptyCaterings[0],
    },
    {
        id: '2',
        login: 'Boom',
        password: '67890',
        catering: emptyCaterings[1],
    },
    {
        id: '3',
        login: 'Moon',
        password: '258693',
        catering: emptyCaterings[2],
    },
];

export const emptyMeals: CateringMeal[] = [
    {
        id: 1,
        name: 'Куриный донер',
        description: 'Лаваш, курица, соленый огурец, помидор, капуста, лук, морковь, зелень.',
        photo: meal1,
        price: 1050,
        disposableTableware: true,
        mealSizes: [
            { name: 'Средний', size: '300 грамм', price: 2100 },
            { name: 'Большой', size: '500 грамм', price: 4100 },
        ],
        mealSauces: [
            { name: 'Сырный', price: 100 },
            { name: 'Кетчуп', price: 100 },
        ],
        mealAdditives: [
            {
                nameAdditive: 'Молоко',
                additiveUnit: [
                    { name: 'Коровье', price: 4100 },
                    { name: 'Птичье', price: 4100 },
                ],
            },
            {
                nameAdditive: 'Печенье',
                additiveUnit: [
                    { name: 'Черный', price: 4100 },
                    { name: 'Белый', price: 4100 },
                ],
            },
        ],
        waitingTime: 15,
        tags: [{ name: 'вега' }, { name: 'овощи' }],
        is_visible: true,
    },
    {
        id: 2,
        name: 'Зеленый чай',
        description: 'Вкусный зеленый чай из Японии. Подается с медом.',
        photo: meal2,
        price: 200,
        disposableTableware: false,
        mealSizes: [
            { name: 'Средний', size: '300 мл', price: 200 },
            { name: 'Большой', size: '500 мл', price: 300 },
        ],
        mealSauces: [],
        mealAdditives: [
            {
                nameAdditive: 'Молоко',
                additiveUnit: [
                    { name: 'Коровье', price: 40 },
                    { name: 'Птичье', price: 70 },
                ],
            },
            {
                nameAdditive: 'Печенье',
                additiveUnit: [
                    { name: 'Песочное', price: 100 },
                    { name: 'Шоколадное', price: 120 },
                ],
            },
        ],
        waitingTime: 10,
        tags: [{ name: 'чай' }, { name: 'зеленый' }],
        is_visible: false,
    },
    {
        id: 3,
        name: 'Чизкейк',
        description: 'Слоеное пироженое с клубникой и конфитюром.',
        photo: meal3,
        price: 500,
        disposableTableware: false,
        mealSizes: [
            { name: 'Средний', size: '300 грамм', price: 500 },
            { name: 'Большой', size: '500 грамм', price: 600 },
        ],
        mealSauces: [],
        mealAdditives: [
            {
                nameAdditive: 'Сироп',
                additiveUnit: [
                    { name: 'Клубничный', price: 50 },
                    { name: 'Мятный', price: 70 },
                ],
            },
        ],
        waitingTime: 7,
        tags: [{ name: 'сладкое' }, { name: 'десерт' }],
        is_visible: true,
    },
];

export const emptyCategories: Category[] = [
    {
        id: 1,
        name: 'Еда',
        photo: meal1,
        meals: [
            {
                id: 1,
                name: 'Куриный донер',
                description: 'Лаваш, курица, соленый огурец, помидор, капуста, лук, морковь, зелень.',
                photo: meal1,
                price: 1050,
                disposableTableware: true,
                mealSizes: [
                    { name: 'Средний', size: '300 грамм', price: 2100 },
                    { name: 'Большой', size: '500 грамм', price: 4100 },
                ],
                mealSauces: [
                    { name: 'Сырный', price: 100 },
                    { name: 'Кетчуп', price: 100 },
                ],
                mealAdditives: [
                    {
                        nameAdditive: 'Молоко',
                        additiveUnit: [
                            { name: 'Коровье', price: 4100 },
                            { name: 'Птичье', price: 4100 },
                        ],
                    },
                    {
                        nameAdditive: 'Печенье',
                        additiveUnit: [
                            { name: 'Черный', price: 4100 },
                            { name: 'Белый', price: 4100 },
                        ],
                    },
                ],
                waitingTime: 15,
                tags: [{ name: 'вега' }, { name: 'овощи' }],
                is_visible: true,
            },
        ],
    },
    {
        id: 2,
        name: 'Напиток',
        photo: drink1,
        meals: [
            {
                id: 2,
                name: 'Зеленый чай',
                description: 'Вкусный зеленый чай из Японии. Подается с медом.',
                photo: meal2,
                price: 200,
                disposableTableware: false,
                mealSizes: [
                    { name: 'Средний', size: '300 мл', price: 200 },
                    { name: 'Большой', size: '500 мл', price: 300 },
                ],
                mealSauces: [],
                mealAdditives: [
                    {
                        nameAdditive: 'Молоко',
                        additiveUnit: [
                            { name: 'Коровье', price: 40 },
                            { name: 'Птичье', price: 70 },
                        ],
                    },
                    {
                        nameAdditive: 'Печенье',
                        additiveUnit: [
                            { name: 'Песочное', price: 100 },
                            { name: 'Шоколадное', price: 120 },
                        ],
                    },
                ],
                waitingTime: 10,
                tags: [{ name: 'чай' }, { name: 'зеленый' }],
                is_visible: false,
            },
        ],
    },
    /* {
        id: 3,
        name: 'Десерт',
        photo: dessert1,
        meals: [
            {
                id: 3,
                name: 'Чизкейк',
                description: 'Слоеное пироженое с клубникой и конфитюром.',
                photo: meal3,
                price: 500,
                disposableTableware: false,
                mealSizes: [
                    { name: 'Средний', size: '300 грамм', price: 500 },
                    { name: 'Большой', size: '500 грамм', price: 600 },
                ],
                mealSauces: [],
                mealAdditives: [
                    {
                        nameAdditive: 'Сироп',
                        additiveUnit: [
                            { name: 'Клубничный', price: 50 },
                            { name: 'Мятный', price: 70 },
                        ],
                    },
                ],
                waitingTime: 7,
                tags: [{ name: 'сладкое' }, { name: 'десерт' }],
                is_visible: true,
            },
        ],
    }, */
];
