import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/adminService/adminService';

export const useGetAdminSchedules = (start: Date, end: Date) => {
    return useQuery({
        queryKey: ['adminSchedules', start, end],
        queryFn: () => adminService.getAdminSchedules(start, end),
    });
};
