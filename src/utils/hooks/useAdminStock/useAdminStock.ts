import { useQuery } from '@tanstack/react-query';
import { adminNewOrderService } from '../../api/adminNewOrderService/adminNewOrderService';

export const useGetAdminStockMeals = (restaurantId: number) => {
    return useQuery({
        queryKey: ['adminStockMeals', restaurantId],
        queryFn: () => adminNewOrderService.getAdminStockMeals(restaurantId),
    });
};
