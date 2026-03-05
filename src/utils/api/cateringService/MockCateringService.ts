import { Restaurant } from '../restaurantsService/restaurantsService';
import { Administrator } from './cateringService';

export const emptyRestaurants: Restaurant[] = [
    {
        id: 1,
        photo: 'https://s3-alpha-sig.figma.com/img/c1bc/aceb/82750fa45a41d3015ac46fd051a8fd22?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Z0qTEr5qI~JRk8~CFXHP3iFDnXCj79P3o~vZ2uBfjJpf5PLnXevL2tO1Yoz69zKmGojAD96qG1-psuYvZZVBAIl2uOUhPB6pDncWLLOGKxlm0lmhob77ded6I-WGTQcud3CFORSlBj68aLKVuXcNLbBKIOahkkE3E4s7hdcZ4iWRXd2AxAM106N8GvucDPSMd2jUokyBfA6zHUrbyz6aGMhLvKg0PRMBkyTaDdrSzlYLD~vwZYT3GRTPbbFCxt2c1TlLk5GhRQ2Suga5QR~HyVjfI6Jz~WBpojuNzvNBascRQSipg~Wq3VbWOwbWDsrdKtm8nSVGFZ~tQk8qPRp4iw__',
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
    },
    {
        id: 2,
        photo: 'https://s3-alpha-sig.figma.com/img/a8ef/2d93/c93fbca696fede8fc1b79c12ab7ea520?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=For3ImZ6o33PBfWaKM5DC6mGpTHv9fIiHgbFRS6gQLiHCKcKxJXwOOig0sI9GGThSeedFYWew6rk30EwwZjQc42jqXhC66mVyWuE7QsTLN7g6dkZUDY-ZQ6OW7oIKJdumX9DCui21bbtFQi2nZ2ccey0RFM5CdoelKY1crm33vlO1WVhYjgRb7cFW7W9mQu~Vh2GIAQxkMxEk2kj~G~tDDLoqTFBaQbzQXJ5jV9wyvI4NqGimUxQtxy0OCfXBggtbmbW-VTtTLotXlj5R29aJfoBqKYSF-6YCjlP4ilf9wEiSX5STsd8S0clyAvgxLE9-CkbdZgj9AxcVaENrwZVpw__',
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
    },
    {
        id: 3,
        photo: 'https://s3-alpha-sig.figma.com/img/624f/a9ce/d0cf8cb9193bbfe3d9919eb8782026d9?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GhpQXpPQfEdo9MbhFWnJ6XOXlPQsroL44tDx-hEN6DtTT13wM4zyIuJnXhgBJ2Kp4HDnYnG~HVSIqTyL3f3S3ANLSr~uWHnWOTq8ZXm5oAaHhe0uocSy~XAJy-uytGr8yjJ6VswAj3a3bM4G4jkJKCarUj~6E3xFvaN9S5mDkGAMhZv25RUPqi8d1OJYgQERIZqviId3c-Y8B7al~lRO7wwLrl3F4CBzgzzD69uHedx2vjwpYirJtAU4CItybrxeVUukCTUl1g305qQyasoVH1yjK0s1lThaikrkWELSJNf6Ntfbdea2sK4rWsae1ykOMwDLYvkNr~JfutBeZH05zw__',
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
