import { handleFetch } from '../../serviceFuncs/handleFetch';
import { AdminClientService, RegularClient } from './adminClientService';

export class AdminClientServiceReal implements AdminClientService {
    async getClientsByPhone(phone: string): Promise<{ data: RegularClient[] }> {
        return handleFetch(`api/restaurants/admin/client/?q=${phone}`);
    }

    async createRegularClient(data: Omit<RegularClient, 'id'>): Promise<{ data: RegularClient }> {
        return handleFetch('api/restaurants/admin/client/', { method: 'POST', data });
    }
}
