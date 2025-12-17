import { PartnershipServiceReal } from './partnershipServiceReal';

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

export interface PartnershipService {
    addPartnership: (data: Partnership) => Promise<{ data: Partnership }>;
}

export const partnershipService = new PartnershipServiceReal();
