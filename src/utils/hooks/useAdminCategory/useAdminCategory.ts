import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/adminService/adminService';

export const useGetAdminCategories = (restaurantId: number) => {
    return useQuery({
        queryKey: ['adminCategories', restaurantId],
        queryFn: () => adminService.getAdminCategories(restaurantId),
    });
};
