import { handleFetch } from '../../serviceFuncs/handleFetch';
import { AdminClientService, RegularClient } from './adminClientService';

export class AdminClientServiceReal implements AdminClientService {
    async getClientsByPhone(phone: string): Promise<{ data: RegularClient[] }> {
        return handleFetch(`api/restaurants/admin/client/?q=${encodeURIComponent(phone)}`);
    }

    async createRegularClient(data: { phone: string; name?: string }): Promise<{ data: RegularClient }> {
        return handleFetch('api/restaurants/admin/client/', { method: 'POST', data });
    }
}
