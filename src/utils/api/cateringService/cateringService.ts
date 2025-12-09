import { CateringServiceMock } from './cateringServiceMock';

export type VenueType = { type: number; name: string };
export const weekdayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
export type TimeString = `${number}:${number}`;

export type Day = {
    weekday: number;
    open_time: TimeString | null;
    close_time: TimeString | null;
};

export type Category = {
    /**
     * Category's id
     */
    id: number;
    /**
     * Category's name
     */
    name: string;
    /**
     * Category's photo
     */
    photo: string;
    /**
     * Category's meals
     */
    meals?: CateringMeal[];
};

export type MealSize = {
    /**
     * Size name (e.g., "Small", "500ml")
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
     * Meal's category
     */
    category?: Category;
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
     * Time taken for meal to be prepared in minutes
     */
    waitingTime?: number;
    /**
     * Venue's tags
     */
    tags?: { name: string }[];
    /**
     * Meal's visible
     */
    is_visible: boolean;
};

export type Administrator = {
    /**
     * Administrator's id
     */
    id: string;
    /**
     * Administrator's login
     */
    login: string;
    /**
     * Administrator's password
     */
    password: string;
    /**
     * Administrator's catering
     */
    catering: Catering;
};

export type Catering = {
    /**
     * Catering's id
     */
    id: number;
    /**
     * Link to Catering's image
     */
    photo: string;
    /**
     * Catering's name
     */
    name: string;
    /**
     * Catering's description
     */
    description?: string;
    /**
     * Catering's rating
     */
    rating: number;
    /**
     * Catering's address
     */
    address: string;
    /**
     * Catering's map coordinates
     */
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    /**
     * Catering's tags
     */
    tags?: { name: string }[];
    /**
     * Catering's type
     */
    type: 'fastFood' | 'cafe' | 'cafeBar';
    /**
     * Catering's working hours for each day of the week
     */
    workingTime?: {
        schedule: Day[];
        is24h: boolean;
    };
    /**
     * Deadline for order cancellation
     */
    cancellationTime?: number;
    /**
     * Catering's categories
     */
    categories?: Category[];
    /**
     * Catering's meals
     */
    meals?: CateringMeal[];
    /**
     * Catering's administrators
     */
    administrators?: Administrator[];
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
    getMealById: (id: number) => Promise<{ data: CateringMeal }>;
    createMeal: (data: Omit<CateringMeal, 'id'>) => Promise<{ data: CateringMeal }>;
    deleteMeal: (id: number) => Promise<{ success: boolean }>;
    updateMeal: (data: Partial<CateringMeal> & { id: number }) => Promise<{ data: CateringMeal }>;

    getCategories: () => Promise<{ data: Category[] }>;
    getCategoryById: (id: number) => Promise<{ data: Category }>;
    createCategory: (data: Omit<Category, 'id'>) => Promise<{ data: Category }>;
}

export const cateringService = new CateringServiceMock();
