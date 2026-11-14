import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '../useCurrentUser/useCurretUser';
import { AdminBasket, adminBasketService, MealForBasket } from '../../api/adminBasketService/adminBasketService';

export const useGetAdminBasket = () => {
    const { isLogin } = useCurrentUser();
    return useQuery({
        queryKey: ['adminBasket'],
        queryFn: () => adminBasketService.getAdminBasket(),
        retry: false,
        enabled: isLogin,
        gcTime: 0,
        staleTime: Infinity,
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
        mutationFn: async ({ mealId, restaurantId, features, count = 1 }: { mealId: number; restaurantId: number; features: { featureId: number; choiceId: number }[]; count?: number }) => {
            const result = await adminBasketService.addAdminMeal(mealId, restaurantId, features);
            for (let i = 1; i < count; i++) {
                await adminBasketService.incrementAdminMeal(result.data.id);
            }
            return result;
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};

const patchBasketMeal = (queryClient: QueryClient, basketMealId: number, updated: MealForBasket | null) => {
    queryClient.setQueryData<{ data: AdminBasket }>(['adminBasket'], (old) => {
        if (!old) return old;
        const meals = updated ? old.data.meals.map((m) => (m.id === basketMealId ? updated : m)) : old.data.meals.filter((m) => m.id !== basketMealId);
        return { ...old, data: { ...old.data, meals } };
    });
};

export const useIncrementAdminMeal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ basketMealId }: { basketMealId: number }) => adminBasketService.incrementAdminMeal(basketMealId),
        onSuccess: ({ data }, { basketMealId }) => patchBasketMeal(queryClient, basketMealId, data),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};

export const useDecrementAdminMeal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ basketMealId }: { basketMealId: number }) => adminBasketService.decrementAdminMeal(basketMealId),
        onSuccess: ({ data }, { basketMealId }) => patchBasketMeal(queryClient, basketMealId, data),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};

export const useDeleteAdminBasketPosition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ basketMealId, count }: { basketMealId: number; count: number }) => {
            for (let i = 0; i < count + 5; i++) {
                const { data } = await adminBasketService.decrementAdminMeal(basketMealId);
                if (data === null) return;
            }
        },
        onSuccess: (_, { basketMealId }) => patchBasketMeal(queryClient, basketMealId, null),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};
