import { CateringMeal } from '../cateringMealService/cateringMealService';
import { CateringServiceMock } from './cateringServiceMock';
import { CateringServiceReal } from './cateringServiceReal';

export type VenueType = { type: number; name: string };
export const weekdayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TimeString = `${number}:${number}`;

export type Day = {
    /**
     * Day's weekday
     */
    weekday: number;
    /**
     * Day's open_time
     */
    open_time: TimeString | null;
    /**
     * Day's close_time
     */
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

export type DailyCategory = {
    /**
     * Category's id
     */
    id: number;
    /**
     * Category's name
     */
    name: string;
    /**
     * Category's meals
     */
    meals?: CateringMeal[];
};

export type WeeklyMenu = {
    daily_categories?: DailyCategory[];
    weekday: Weekday;
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
    rating?: number;
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
    type: 'fastFood' | 'cafe' | 'cafeBar' | 'businessCenter';
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
    cancellation_time_limit?: string;
    /**
     * Catering's legal_name
     */
    legal_name: string;
    /**
     * Catering's legal_bin
     */
    legal_bin: string;
    /**
     * Catering's legal_address
     */
    legal_address: string;
    /**
     * Catering's legal_director_fullname
     */
    legal_director_fullname: string;
};

export const DAYS: Day[] = Array.from({ length: 7 }, (_, weekday) => ({
    weekday,
    open_time: null,
    close_time: null,
}));

export const TYPES = ['fastFood', 'cafe', 'cafeBar', 'businessCenter'].map((type, index) => {
    return { type: index, name: type };
});

export interface CateringService {
    getCaterings: () => Promise<{ data: Catering[] }>;
    getCateringById: (cateringId: number) => Promise<{ data: Catering }>;
    createCatering: (data: FormData) => Promise<{ data: Catering }>;
    deleteCatering: (cateringId: number) => Promise<{ success: boolean }>;
    updateCatering: (cateringId: number, data: FormData) => Promise<{ data: Catering }>;
}

export const cateringService = new CateringServiceReal();
export interface MockCateringService {
    getCategories: () => Promise<{ data: Category[] }>;
    getCategoryById: (id: number) => Promise<{ data: Category }>;
    createCategory: (data: Omit<Category, 'id'>) => Promise<{ data: Category }>;

    getWeeklyMenu: () => Promise<{ data: WeeklyMenu[] }>;
    getWeeklyMenuByWeekday: (weekday: string) => Promise<{ data: WeeklyMenu }>;
    addCategoryToWeeklyMenu: (weekday: Weekday, category: Omit<DailyCategory, 'id'>) => Promise<{ data: WeeklyMenu }>;
    deleteCategoryToWeeklyMenu: (weekday: Weekday, dailyCategoryId: number) => Promise<{ data: WeeklyMenu }>;
    updateCategoryToWeeklyMenu: (weekday: Weekday, category: Partial<DailyCategory> & { id: number }) => Promise<{ data: WeeklyMenu }>;
}

export const cateringServiceMock = new CateringServiceMock();
