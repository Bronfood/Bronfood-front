import { Category } from '../cateringService/cateringService';
import { CateringMealServiceReal } from './cateringMealServiceReal';

export type Choice = {
    /**
     * Choice's id
     */
    id: number;
    /**
     * Choice's name ("Small", "500ml")
     */
    name: string;
    /**
     * Choice's price
     */
    price: number;
    /**
     * Choice's is_visible
     */
    is_visible: boolean;
    /**
     * Choice's is_default
     */
    is_default: boolean;
    /**
     * Choice's order
     */
    order?: number;
};

export type Feature = {
    /**
     * Feature's id
     */
    id: number;
    /**
     * Feature's name (Sauce, Size, Additive)
     */
    name: string;
    /**
     * Feature's selection_type
     */
    selection_type: 'single' | 'multiple' | 'optional';
    /**
     * Feature's pricing_strategy
     */
    pricing_strategy: 'add' | 'override' | 'multiply';
    /**
     * Feature's order
     */
    order?: number;
    /**
     * Feature's choices
     */
    choices: Choice[];
};

export type CateringMeal = {
    /**
     * Meal's id
     */
    id: number;
    /**
     * Meal's name
     */
    name: string;
    /**
     * Meal's description
     */
    description?: string;
    /**
     * Meal's type
     */
    type: 'food' | 'drink' | 'dessert';
    /**
     * Meal's waiting_time
     */
    waiting_time: string;
    /**
     * Link to meal's image
     */
    photo: string;
    /**
     * Venue's tags
     */
    tags?: { name: string }[];
    /**
     * Meal's base_price
     */
    base_price: number;
    /**
     * Meal's is_visible
     */
    is_visible: boolean;
    /**
     * Meal's features
     */
    features?: Feature[];
    /**
     * Meal's category
     */
    category?: Category;
};

export interface CateringMealService {
    getCateringMeals: (cateringId: number) => Promise<{ data: CateringMeal[] }>;
    getCateringMealById: (cateringId: number, cateringMealId: number) => Promise<{ data: CateringMeal }>;
    createCateringMeal: (cateringId: number, data: FormData) => Promise<{ data: CateringMeal }>;
    deleteCateringMeal: (cateringId: number, cateringMealId: number) => Promise<{ success: boolean }>;
    updateCateringMeal: (cateringId: number, cateringMealId: number, data: FormData) => Promise<{ data: CateringMeal }>;
}

export const cateringMealService = new CateringMealServiceReal();
