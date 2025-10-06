import { MealType } from './api/restaurantsService/restaurantsService';
import { increment } from './serviceFuncs/increment';
/**
 * includes cyrillic alphabet, * includes latin alphabet, * includes kazakh alphabet,
 * includes dash, * only one space after words, * not space in the end
 */
export const regexClientName: RegExp = /^([a-zA-Z\\-]+(?:\s[a-zA-Z\\-]+)|[a-яА-ЯёЁ\\-]+(?:\s[a-яА-ЯёЁ\\-]+)*|[a-яА-ЯёЁ-ӘҒҚҢӨҰҮІі]+(?:\s[a-яА-ЯёЁ-ӘҒҚҢӨҰҮІі]+)*)$/;
export const regexPassword: RegExp = /^[A-Za-z\d!@#$%^&*()-_+=<>?]{4,256}$/;
export const regexPhoneNumberKazakhstan: RegExp = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
export const regexCaptcha: RegExp = /^[A-Za-z0-9]+$/;
export const regexEmail: RegExp = /.+@.+\..+/;
export const regexAddress: RegExp = /^[a-zA-Zа-яА-ЯёЁӘәҒғҚқҢңӨөҰұҮүІі0-9\s.,/\-–—()"']{1,256}$/;
export const regexMessage: RegExp = /^[\s\S]{10,5000}$/;

export const API_URL = 'https://80.90.183.184';
export const mealTypes: MealType[] = ['food', 'drink', 'dessert'];
export const types = ['fastFood', 'cafe', 'cafeBar'].map((type) => {
    return { id: increment(), name: type, selected: false };
});

export const DEBOUNCE_VALUE = 1000;
