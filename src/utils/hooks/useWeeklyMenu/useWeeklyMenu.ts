import { useMutation, useQuery } from '@tanstack/react-query';
import { cateringService, DailyCategory, Weekday } from '../../api/cateringService/cateringService';

export const useGetWeeklyMenu = () => {
    return useQuery({
        queryKey: ['weeklyMenu'],
        queryFn: () => cateringService.getWeeklyMenu(),
    });
};

export const useGetWeeklyMenuByWeekday = (weekday: string) => {
    return useQuery({
        queryKey: ['weeklyMenu', weekday],
        queryFn: () => cateringService.getWeeklyMenuByWeekday(weekday),
        enabled: !!weekday,
    });
};

export const useAddCategoryToWeeklyMenu = () => {
    return useMutation({
        mutationFn: ({ weekday, category }: { weekday: Weekday; category: Omit<DailyCategory, 'id'> }) => cateringService.addCategoryToWeeklyMenu(weekday, category),
    });
};

export const useDeleteCategoryToWeeklyMenu = () => {
    return useMutation({
        mutationFn: ({ weekday, dailyCategoryId }: { weekday: Weekday; dailyCategoryId: number }) => cateringService.deleteCategoryToWeeklyMenu(weekday, dailyCategoryId),
    });
};

export const useUpdateCategoryToWeeklyMenu = () => {
    return useMutation({
        mutationFn: ({ weekday, category }: { weekday: Weekday; category: Partial<DailyCategory> & { id: number } }) => cateringService.updateCategoryToWeeklyMenu(weekday, category),
    });
};
