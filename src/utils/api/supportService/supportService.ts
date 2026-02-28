import { SupportServiceReal } from './supportServiceReal';

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
     * support's status
     */
    status: string;
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
};

export interface SupportService {
    addSupportRequest: (data: FormData) => Promise<{ data: Support }>;
}

export const supportService = new SupportServiceReal();
