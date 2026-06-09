import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cateringWeeklyMenuServiceMock, DailyCategory, Weekday } from '../../api/cateringWeeklyMenuService/cateringWeeklyMenuService';

export const useGetWeeklyMenu = () => {
    return useQuery({
        queryKey: ['weeklyMenu'],
        queryFn: () => cateringWeeklyMenuServiceMock.getWeeklyMenu(),
    });
};

export const useGetWeeklyMenuByWeekday = (weekday: string) => {
    return useQuery({
        queryKey: ['weeklyMenu', weekday],
        queryFn: () => cateringWeeklyMenuServiceMock.getWeeklyMenuByWeekday(weekday),
        enabled: !!weekday,
    });
};

export const useAddCategoryToWeeklyMenu = () => {
    return useMutation({
        mutationFn: ({ weekday, category }: { weekday: Weekday; category: Omit<DailyCategory, 'id'> }) => cateringWeeklyMenuServiceMock.addCategoryToWeeklyMenu(weekday, category),
    });
};

export const useDeleteCategoryToWeeklyMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ weekday, dailyCategoryId }: { weekday: Weekday; dailyCategoryId: number }) => cateringWeeklyMenuServiceMock.deleteCategoryToWeeklyMenu(weekday, dailyCategoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['weeklyMenu'] });
        },
    });
};

export const useUpdateCategoryToWeeklyMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ weekday, category }: { weekday: Weekday; category: Partial<DailyCategory> & { id: number } }) => cateringWeeklyMenuServiceMock.updateCategoryToWeeklyMenu(weekday, category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['weeklyMenu'] });
        },
    });
};
