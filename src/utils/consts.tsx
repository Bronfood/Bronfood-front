import { EasingFunctionDescription, LngLat } from '@yandex/ymaps3-types';
import { increment } from './serviceFuncs/increment';
import { AdminNewOrderClientData, NewOrderTimeData } from './api/adminService/adminService';
/**
 * includes cyrillic alphabet, * includes latin alphabet, * includes kazakh alphabet,
 * includes dash, * only one space after words, * not space in the end
 */
export const regexClientName: RegExp = /^([a-zA-Z\\-]+(?:\s[a-zA-Z\\-]+)|[a-яА-ЯёЁ\\-]+(?:\s[a-яА-ЯёЁ\\-]+)*|[a-яА-ЯёЁ-ӘҒҚҢӨҰҮІі]+(?:\s[a-яА-ЯёЁ-ӘҒҚҢӨҰҮІі]+)*)$/;
export const regexPassword: RegExp = /^[A-Za-z\d!@#$%^&*()-_+=<>?]{4,256}$/;
export const regexPhoneNumberKazakhstan: RegExp = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
export const regexAddress: RegExp = /^[a-zA-Zа-яА-ЯёЁӘәҒғҚқҢңӨөҰұҮүІі0-9\s.,/\-–—()"']{1,256}$/;
export const regexNumber: RegExp = /^[0-9]{1,256}$/;
export const regexTime: RegExp = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const regexTextBasic: RegExp = /^[a-zA-Zа-яА-ЯёЁ\s\d.,!?;:«»"“”‘’'()[\]{}<>\-–—]+/;
export const regexCaptcha: RegExp = /^[A-Za-z0-9]+$/;
export const regexEmail: RegExp = /.+@.+\..+/;
export const regexMessage: RegExp = /^[\s\S]{10,5000}$/;
export const regex24HourTime: RegExp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const MASKPHONE = '+_ (___) ___-__-__';
export const MASKTIME = '__:__';
export const REPLACEMENT = { _: /\d/ };

export const RESTAURANT_UTC_OFFSET_MIN = 5 * 60;

export const types = ['fastFood', 'cafe', 'cafeBar'].map((type) => {
    return { id: increment(), name: type, selected: false };
});

export const FULFILLMENTS: { name: 'delivery' | 'pickup' | 'dine_in'; label: string }[] = [
    { name: 'pickup', label: 'pages.admin.pickup' },
    { name: 'delivery', label: 'pages.admin.delivery' },
    { name: 'dine_in', label: 'pages.admin.inHall' },
];

export const INITIAL_TIME_DATA: NewOrderTimeData = { inTime: '', inTimeUnit: 'min', certainTime: '', deliveryDurationUnit: 'min' };
export const INITIAL_CLIENT_DATA: Partial<AdminNewOrderClientData> = { fulfillment: 'pickup' };

export const INITIAL_CENTER: LngLat = [76.921552, 43.246345];
export const ZOOM = 12;

export const ORDERS_COUNT = 2;
export const DEBOUNCE_VALUE = 1000;
export const CLUSTER_GRIDSIZE = 64;
export const COMMON_LOCATION_PARAMS: { easing: EasingFunctionDescription; duration: number } = { easing: 'ease-in-out', duration: 1000 };

export type CropParams = {
    scale: number;
    posX: number;
    posY: number;
};
export type CropState = {
    originalImages: Record<number, string>;
    cropParams: Record<number, CropParams>;
};
