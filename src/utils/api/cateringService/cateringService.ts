import { CateringServiceMock } from './cateringServiceMock';

export type VenueType = { type: number; name: string };
export const weekdayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
export type TimeString = `${number}:${number}`;

export type Day = {
    weekday: number;
    open_time: TimeString | null;
    close_time: TimeString | null;
};

export type Catering = {
    /**
     * Venue's id
     */
    id: number;
    /**
     * Link to venue's image
     */
    photo: string;
    /**
     * Venue's name
     */
    name: string;
    /**
     * Venue's description
     */
    description?: string;
    /**
     * Venue's rating
     */
    rating: number;
    /**
     * Venue's address
     */
    address: string;
    /**
     * Venue's map coordinates
     */
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    /**
     * Venue's tags
     */
    tags?: { name: string }[];
    /**
     * Venue's type
     */
    type: 'fastFood' | 'cafe' | 'cafeBar';
    /**
     * Venue's working hours for each day of the week
     */
    workingTime?: {
        schedule: Day[];
        is24h: boolean;
    };
    /**
     * Deadline for order cancellation
     */
    cancellationTime?: number;
};

export type MealSize = {
    /**
     * Size name (e.g., "Small", "Large", "500ml")
     */
    name: string;
    /**
     * Size or volume (e.g., "100г", "500мл")
     */
    size: string;
    /**
     * Price for this size
     */
    price: number;
};

export type MealSauce = {
    /**
     * Sauce name
     */
    name: string;
    /**
     * Price for this sauce
     */
    price: number;
};

export type MealAdditiveUnit = {
    /**
     * AdditiveUnit name
     */
    name: string;
    /**
     * Price for this AdditiveUnit
     */
    price: number;
};

export type MealAdditive = {
    /**
     * Additive name (e.g., "Milk")
     */
    nameAdditive: string;
    /**
     * Additive unit (e.g., "Cow's")
     */
    additiveUnit: MealAdditiveUnit[];
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
     * Link to meal's image
     */
    photo: string;
    /**
     * Meal's price
     */
    price: number;
    /**
     * Meal's disposable tableware
     */
    disposableTableware: boolean;
    /**
     * Array of meal sizes
     */
    mealSizes?: MealSize[];
    /**
     * Array of meal sauce
     */
    mealSauces?: MealSauce[];
    /**
     * Array of meal sauce
     */
    mealAdditives?: MealAdditive[];
    /**
     * Meal's type
     */
    type?: 'food' | 'drink' | 'dessert';
    /**
     * Time taken for meal to be prepared in minutes
     */
    waitingTime?: number;
    /**
     * Venue's tags
     */
    tags?: { name: string }[];
};

export type Administrator = {
    id: string;
    login: string;
    password: string;
    catering: Catering;
};

export const DAYS: Day[] = Array.from({ length: 7 }, (_, weekday) => ({
    weekday,
    open_time: null,
    close_time: null,
}));

export const TYPES = ['fastFood', 'cafe', 'cafeBar'].map((type, index) => {
    return { type: index, name: type };
});

export interface CateringService {
    getAdministrators: () => Promise<{ data: Administrator[] }>;
    getAdministratorById: (id: string) => Promise<{ data: Administrator }>;
    createAdministrator: (data: Omit<Administrator, 'id'>) => Promise<{ data: Administrator }>;
    updateAdministrator: (data: Partial<Administrator> & { id: string }) => Promise<{ data: Administrator }>;
    deleteAdministrator: (id: string) => Promise<{ success: boolean }>;

    getCaterings: () => Promise<{ data: Catering[] }>;
    getCateringById: (id: number) => Promise<{ data: Catering }>;
    createCatering: (data: Omit<Catering, 'id'>) => Promise<{ data: Catering }>;
    deleteCatering: (id: number) => Promise<{ success: boolean }>;
    updateCatering: (data: Partial<Catering> & { id: number }) => Promise<{ data: Catering }>;

    getMeals: () => Promise<{ data: CateringMeal[] }>;
    createMeal: (data: Omit<CateringMeal, 'id'>) => Promise<{ data: CateringMeal }>;
}

export const cateringService = new CateringServiceMock();
