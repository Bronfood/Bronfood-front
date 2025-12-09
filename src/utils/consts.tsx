import { MealType } from './api/restaurantsService/restaurantsService';
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

export const API_URL = 'http://localhost:8000';
export const mealTypes: MealType[] = ['food', 'drink', 'dessert'];

export const DEBOUNCE_VALUE = 1000;
