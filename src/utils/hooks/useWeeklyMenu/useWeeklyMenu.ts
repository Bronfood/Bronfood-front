import { useMutation, useQuery } from '@tanstack/react-query';
import { cateringServiceMock, DailyCategory, Weekday } from '../../api/cateringService/cateringService';

export const useGetWeeklyMenu = () => {
    return useQuery({
        queryKey: ['weeklyMenu'],
        queryFn: () => cateringServiceMock.getWeeklyMenu(),
    });
};

export const useGetWeeklyMenuByWeekday = (weekday: string) => {
    return useQuery({
        queryKey: ['weeklyMenu', weekday],
        queryFn: () => cateringServiceMock.getWeeklyMenuByWeekday(weekday),
        enabled: !!weekday,
    });
};

export const useAddCategoryToWeeklyMenu = () => {
    return useMutation({
        mutationFn: ({ weekday, category }: { weekday: Weekday; category: Omit<DailyCategory, 'id'> }) => cateringServiceMock.addCategoryToWeeklyMenu(weekday, category),
    });
};

export const useDeleteCategoryToWeeklyMenu = () => {
    return useMutation({
        mutationFn: ({ weekday, dailyCategoryId }: { weekday: Weekday; dailyCategoryId: number }) => cateringServiceMock.deleteCategoryToWeeklyMenu(weekday, dailyCategoryId),
    });
};

export const useUpdateCategoryToWeeklyMenu = () => {
    return useMutation({
        mutationFn: ({ weekday, category }: { weekday: Weekday; category: Partial<DailyCategory> & { id: number } }) => cateringServiceMock.updateCategoryToWeeklyMenu(weekday, category),
    });
};
