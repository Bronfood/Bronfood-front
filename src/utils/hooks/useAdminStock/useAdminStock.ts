import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminMealStock, AdminStockFilters, adminStockService, MealChoice } from '../../api/adminStockService/adminStockService';

export const useGetAdminStockMeals = (restaurantId: number, filters: AdminStockFilters = {}) => {
    return useQuery({
        queryKey: ['adminStockMeals', restaurantId, filters],
        queryFn: () => adminStockService.getAdminStockMeals(restaurantId, filters),
    });
};

export const useSetAdminStockMealVisibility = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ restaurantId, mealId, payload }: { restaurantId: number; mealId: number; payload: Pick<AdminMealStock, 'is_visible'> }) => adminStockService.setAdminStockMealVisibility(restaurantId, mealId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminStockMeals', variables.restaurantId] });
        },
    });
};

export const useSetAdminStockMealChoiceVisibility = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ restaurantId, mealId, choiceId, payload }: { restaurantId: number; mealId: number; choiceId: number; payload: Pick<MealChoice, 'is_visible'> }) => adminStockService.setAdminStockMealChoiceVisibility(restaurantId, mealId, choiceId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminStockMeals', variables.restaurantId] });
        },
    });
};
