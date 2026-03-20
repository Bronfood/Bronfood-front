import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/adminService/adminService';

export const useGetAdminSchedules = () => {
    return useQuery({
        queryKey: ['adminSchedules'],
        queryFn: () => adminService.getAdminSchedules,
    });
};
