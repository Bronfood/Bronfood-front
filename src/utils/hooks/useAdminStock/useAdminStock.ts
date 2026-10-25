import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminMealStock, AdminStockFilters, adminStockService, MealChoice } from '../../api/adminStockService/adminStockService';

export const useGetAdminStockMeals = (restaurantId: number, filters: AdminStockFilters = {}) => {
    return useQuery({
        queryKey: ['adminStockMeals', restaurantId, filters],
        queryFn: () => adminStockService.getAdminStockMeals(restaurantId, filters),
        enabled: !!restaurantId,
    });
};

export const useSetAdminStockMealVisibility = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ restaurantId, mealId, payload }: { restaurantId: number; mealId: number; payload: Pick<AdminMealStock, 'is_visible'> }) => adminStockService.setAdminStockMealVisibility(restaurantId, mealId, payload),
        onSuccess: ({ data: updatedMeal }, { restaurantId }) => {
            queryClient.setQueriesData<{ data: AdminMealStock[] }>({ queryKey: ['adminStockMeals', restaurantId] }, (old) => old && { ...old, data: old.data.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal)) });
            queryClient.invalidateQueries({ queryKey: ['adminStockMeals', restaurantId] });
        },
    });
};

export const useSetAdminStockMealChoiceVisibility = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ restaurantId, mealId, choiceId, payload }: { restaurantId: number; mealId: number; choiceId: number; payload: Pick<MealChoice, 'is_visible'> }) => adminStockService.setAdminStockMealChoiceVisibility(restaurantId, mealId, choiceId, payload),
        onSuccess: ({ data: updatedChoice }, { restaurantId, mealId }) => {
            queryClient.setQueriesData<{ data: AdminMealStock[] }>(
                { queryKey: ['adminStockMeals', restaurantId] },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.map((meal) =>
                            meal.id !== mealId
                                ? meal
                                : {
                                      ...meal,
                                      features: meal.features?.map((feature) => ({
                                          ...feature,
                                          choices: feature.choices.map((choice) => (choice.id === updatedChoice.id ? updatedChoice : choice)),
                                      })),
                                  }
                        ),
                    }
            );
            queryClient.invalidateQueries({ queryKey: ['adminStockMeals', restaurantId] });
        },
    });
};
