import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminServiceMock } from '../../api/adminService/adminService';

export const useGetAdminBasket = () => {
    return useQuery({
        queryKey: ['adminBasket'],
        queryFn: () => adminServiceMock.getAdminBasket(),
    });
};

export const useDeleteMealInBasket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ mealId }: { mealId: number }) => adminServiceMock.deleteMealInBasket(mealId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};
