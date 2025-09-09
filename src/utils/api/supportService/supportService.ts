import { SupportServiceReal } from './supportServiceReal';

export type Partnership = {
    restaurant_name: string;
    address: string;
    user_name: string;
    email: string;
    phone: string;
    message: string;
};

export interface SupportService {
    addPartnership: (data: Partnership) => Promise<{ data: Partnership }>;
}

export const supportService = new SupportServiceReal();
