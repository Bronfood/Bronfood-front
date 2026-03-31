import { handleFetch } from '../../serviceFuncs/handleFetch';
import { handleFormDataFetch } from '../../serviceFuncs/handleFormDataFetch';
import { Catering, CateringService } from './cateringService';

export class CateringServiceReal implements CateringService {
    async getCaterings(): Promise<{ data: Catering[] }> {
        return handleFetch('api/dashboard/restaurants/');
    }

    async getCateringById(cateringId: number): Promise<{ data: Catering }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/`);
    }

    async createCatering(data: FormData): Promise<{ data: Catering }> {
        return handleFormDataFetch('api/dashboard/restaurants/', { method: 'POST', data });
    }

    async deleteCatering(cateringId: number): Promise<{ success: boolean }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/`, { method: 'DELETE' });
    }

    async updateCatering(cateringId: number, data: FormData): Promise<{ data: Catering }> {
        return handleFormDataFetch(`api/dashboard/restaurants/${cateringId}/`, {
            method: 'PUT',
            data,
        });
    }
}
