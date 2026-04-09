import { useMutation, useQuery } from '@tanstack/react-query';
import { Manager, managerService } from '../../api/managerService/managerService';

export const useGetManagers = (cateringId: number) => {
    return useQuery({
        queryKey: ['managers', cateringId],
        queryFn: () => managerService.getManagers(cateringId),
    });
};

export const useGetManagerById = (cateringId: number, managerId: number) => {
    return useQuery({
        queryKey: ['managers', cateringId, managerId],
        queryFn: () => managerService.getManagerById(cateringId, managerId),
        enabled: !!cateringId && !!managerId,
    });
};

export const useCreateManager = () => {
    return useMutation({
        mutationFn: ({ cateringId, data }: { cateringId: number; data: Omit<Manager, 'id'> }) => managerService.createManager(cateringId, data),
    });
};

export const useDeleteManager = () => {
    return useMutation({
        mutationFn: ({ cateringId, managerId }: { cateringId: number; managerId: number }) => managerService.deleteManager(cateringId, managerId),
    });
};

export const useUpdateManager = () => {
    return useMutation({
        mutationFn: ({ cateringId, data }: { cateringId: number; data: Partial<Manager> & { managerId: number } }) => managerService.updateManager(cateringId, data),
    });
};
