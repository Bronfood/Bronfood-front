import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cateringMealService } from '../../api/cateringMealService/cateringMealService';

export const useGetCateringMeals = (cateringId: number) => {
    return useQuery({
        queryKey: ['cateringMeals', cateringId],
        queryFn: () => cateringMealService.getCateringMeals(cateringId),
    });
};

export const useGetCateringMealById = (cateringId: number, cateringMealId: number) => {
    return useQuery({
        queryKey: ['cateringMeals', cateringId, cateringMealId],
        queryFn: () => cateringMealService.getCateringMealById(cateringId, cateringMealId),
        enabled: !!cateringId && !!cateringMealId,
    });
};

export const useCreateCateringMeal = () => {
    return useMutation({
        mutationFn: ({ cateringId, data }: { cateringId: number; data: FormData }) => cateringMealService.createCateringMeal(cateringId, data),
    });
};

export const useDeleteCateringMeal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cateringId, cateringMealId }: { cateringId: number; cateringMealId: number }) => cateringMealService.deleteCateringMeal(cateringId, cateringMealId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cateringMeals', variables.cateringId] });
        },
    });
};

export const useUpdateCateringMeal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cateringId, cateringMealId, data }: { cateringId: number; cateringMealId: number; data: FormData }) => cateringMealService.updateCateringMeal(cateringId, cateringMealId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cateringMeals', variables.cateringId] });
        },
    });
};

export const useCopyMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cateringId, fromRestaurantId }: { cateringId: number; fromRestaurantId: number }) => cateringMealService.copyMenu(cateringId, fromRestaurantId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cateringMeals', variables.cateringId] });
        },
    });
};
