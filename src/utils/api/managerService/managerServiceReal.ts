import { handleFetch } from '../../serviceFuncs/handleFetch';
import { Manager, ManagerService } from './managerService';

export class ManagerServiceReal implements ManagerService {
    async getManagers(cateringId: number): Promise<{ data: Manager[] }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/managers/`);
    }

    async getManagerById(cateringId: number, managerId: number): Promise<{ data: Manager }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/managers/${managerId}`);
    }

    async createManager(cateringId: number, data: Omit<Manager, 'id'>): Promise<{ data: Manager }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/managers/`, { method: 'POST', data });
    }

    async deleteManager(cateringId: number, managerId: number): Promise<{ success: boolean }> {
        return handleFetch(`api/dashboard/restaurants/${cateringId}/managers/${managerId}/`, { method: 'DELETE' });
    }

    async updateManager(cateringId: number, data: Partial<Manager> & { managerId: number }): Promise<{ data: Manager }> {
        const { managerId, ...updateData } = data;
        return handleFetch(`api/dashboard/restaurants/${cateringId}/managers/${managerId}/`, {
            method: 'PUT',
            data: updateData,
        });
    }
}
