import { useQuery } from '@tanstack/react-query';
import { adminServiceMock } from '../../api/adminService/adminService';

export const useGetFoodForOrder = () => {
    return useQuery({
        queryKey: ['food'],
        queryFn: () => adminServiceMock.getFoodForOrder(),
    });
};
