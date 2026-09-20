import { useQuery } from '@tanstack/react-query';
import { adminServiceMock } from '../../api/adminService/adminService';

export const useGetMealsStock = () => {
    return useQuery({
        queryKey: ['mealsStock'],
        queryFn: () => adminServiceMock.getMealsStock(),
    });
};
