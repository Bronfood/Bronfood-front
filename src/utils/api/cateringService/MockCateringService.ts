import { Restaurant } from '../restaurantsService/restaurantsService';
import { Administrator } from './cateringService';
import restaurant1 from './MockImages/restaurant1.png';
import restaurant2 from './MockImages/restaurant2.png';
import restaurant3 from './MockImages/restaurant3.png';

export const emptyRestaurants: Restaurant[] = [
    {
        id: 1,
        photo: restaurant1,
        name: 'Jahu',
        rating: 4.8,
        address: 'ул. Березовая 21',
        coordinates: { latitude: 0, longitude: 0 },
        workingTime: '09:00-22:00',
        isFavorite: false,
        type: 'fastFood',
        description: 'Изысканные блюда европейской кухни. К нам хочется вернуться.',
        legal_address: '11111',
        legal_bin: '11112',
        legal_director_fullname: '11113',
        legal_name: '11114',
        categories: [
            {
                id: 1,
                name: 'Первое',
            },
            {
                id: 2,
                name: 'Второе',
            },
        ],
    },
    {
        id: 2,
        photo: restaurant2,
        name: 'Boom',
        rating: 0,
        address: 'ул. Морозова 56/1',
        coordinates: { latitude: 0, longitude: 0 },
        workingTime: '09:00-22:00',
        isFavorite: false,
        type: 'fastFood',
        description: 'Изысканные блюда европейской кухни. К нам хочется вернуться.',
        legal_address: '11111',
        legal_bin: '11112',
        legal_director_fullname: '11113',
        legal_name: '11114',
        categories: [
            {
                id: 1,
                name: 'Первое',
            },
            {
                id: 2,
                name: 'Второе',
            },
        ],
    },
    {
        id: 3,
        photo: restaurant3,
        name: 'Moon',
        rating: 0,
        address: 'ул. Березовая 21',
        coordinates: { latitude: 0, longitude: 0 },
        workingTime: '09:00-22:00',
        isFavorite: false,
        type: 'fastFood',
        description: null,
        legal_address: '11111',
        legal_bin: '11112',
        legal_director_fullname: '11113',
        legal_name: '11114',
        categories: [
            {
                id: 1,
                name: 'Первое',
            },
            {
                id: 2,
                name: 'Второе',
            },
        ],
    },
];

export const mockCateringService: Administrator[] = [
    {
        id: '1',
        login: 'Jahu',
        password: '12345',
        restaurant: emptyRestaurants[0],
    },
    {
        id: '2',
        login: 'Boom',
        password: '67890',
        restaurant: emptyRestaurants[1],
    },
    {
        id: '3',
        login: 'Moon',
        password: '258693',
        restaurant: emptyRestaurants[2],
    },
];
