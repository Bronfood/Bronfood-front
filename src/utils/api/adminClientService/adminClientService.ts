import { AdminClientServiceReal } from './adminClientServiceReal';

export type RegularClient = {
    /**
     * client id
     */
    id: number;
    /**
     * client name
     */
    name: string;
    /**
     * client phone
     */
    phone: string;
};

export interface AdminClientService {
    getClientsByPhone: (phone: string) => Promise<{ data: RegularClient[] }>;
    createRegularClient: (data: { phone: string; name?: string }) => Promise<{ data: RegularClient }>;
}

export const adminClientService = new AdminClientServiceReal();
