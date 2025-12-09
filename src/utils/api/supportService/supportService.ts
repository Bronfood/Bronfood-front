import { SupportServiceReal } from './supportServiceReal';

export type GeneralSupport = {
    /**
     * support's id
     */
    id: number;
    /**
     * support's created_at
     */
    created_at: string;
    /**
     * user's name
     */
    user_name: string;
    /**
     * user's phone
     */
    phone: string;
    /**
     * user's email
     */
    email: string;
    /**
     * user's message
     */
    message: string;
    /**
     * user's images
     */
    images?: string[];
    /**
     * support's status
     */
    status: string;
};

export type Partnership = {
    /**
     * restaurant's name
     */
    restaurant_name: string;
    /**
     * restaurant's address
     */
    address: string;
    /**
     * user's name
     */
    user_name: string;
    /**
     * user's email
     */
    email: string;
    /**
     * user's phone
     */
    phone: string;
    /**
     * user's message
     */
    message: string;
};

export interface SupportService {
    addPartnership: (data: Partnership) => Promise<{ data: Partnership }>;
}

export interface MockSupportService {
    addGeneralSupportRequest: (data: Omit<GeneralSupport, 'id'>) => Promise<{ data: GeneralSupport }>;
    addPartnership: (data: Partnership) => Promise<{ data: Partnership }>;
}

export const supportService = new SupportServiceReal();
/* export const supportService = new SupportServiceMock(); */
