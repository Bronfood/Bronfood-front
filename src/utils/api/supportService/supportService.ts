import { SupportServiceMock } from './supportServiceMock';

export type Support = {
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

export interface SupportService {
    addSupportRequest: (data: Omit<Support, 'id'>) => Promise<{ data: Support }>;
}

export const supportService = new SupportServiceMock();
