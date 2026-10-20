import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '../useCurrentUser/useCurretUser';
import { adminBasketService } from '../../api/adminBasketService/adminBasketService';

export const useGetAdminBasket = () => {
    const { isLogin } = useCurrentUser();
    return useQuery({
        queryKey: ['adminBasket'],
        queryFn: () => adminBasketService.getAdminBasket(),
        retry: false,
        enabled: isLogin,
    });
};

export const useEmptyAdminBasket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (basketId: number) => adminBasketService.emptyAdminBasket(basketId),
        onSuccess: () => queryClient.removeQueries({ queryKey: ['adminBasket'] }),
    });
};

export const useAddAdminMeal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ mealId, restaurantId, features }: { mealId: number; restaurantId: number; features: { featureId: number; choiceId: number }[] }) => adminBasketService.addAdminMeal(mealId, restaurantId, features),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};

export const useIncrementAdminMeal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ mealId }: { mealId: number }) => adminBasketService.incrementAdminMeal(mealId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};

export const useDecrementAdminMeal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ mealId }: { mealId: number }) => adminBasketService.decrementAdminMeal(mealId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};
