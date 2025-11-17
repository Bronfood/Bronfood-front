import { useMutation, useQuery } from '@tanstack/react-query';
import { CateringMeal, cateringService } from '../../api/cateringService/cateringService';

export const useGetCateringMeals = () => {
    return useQuery({
        queryKey: ['meals'],
        queryFn: () => cateringService.getMeals(),
    });
};

export const useCreateCateringMeals = () => {
    return useMutation({
        mutationFn: (data: Omit<CateringMeal, 'id'>) => cateringService.createMeal(data),
    });
};

export const useDeleteCateringMeal = () => {
    return useMutation({
        mutationFn: (id: number) => cateringService.deleteMeal(id),
    });
};

export const useGetMealById = (id: number) => {
    return useQuery({
        queryKey: ['meal', id],
        queryFn: () => cateringService.getMealById(id),
        enabled: !!id,
    });
};

export const useUpdateMeal = () => {
    return useMutation({
        mutationFn: (data: Partial<CateringMeal> & { id: number }) => cateringService.updateMeal(data),
    });
};
