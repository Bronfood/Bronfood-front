import { ManagerServiceReal } from './managerServiceReal';

export type Manager = {
    /**
     * Manager's id
     */
    id: number;
    /**
     * Manager's username
     */
    username: string;
    /**
     * Manager's name
     */
    name: string;
    /**
     * Manager's password
     */
    password: string;
};

export interface ManagerService {
    getManagers: (cateringId: number) => Promise<{ data: Manager[] }>;
    getManagerById: (cateringId: number, managerId: number) => Promise<{ data: Manager }>;
    createManager: (cateringId: number, data: Omit<Manager, 'id'>) => Promise<{ data: Manager }>;
    deleteManager: (cateringId: number, managerId: number) => Promise<{ success: boolean }>;
    updateManager: (cateringId: number, data: Partial<Manager> & { managerId: number }) => Promise<{ data: Manager }>;
}

export const managerService = new ManagerServiceReal();
