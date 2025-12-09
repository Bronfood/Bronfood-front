import { useMutation, useQuery } from '@tanstack/react-query';
import { Category, cateringService } from '../../api/cateringService/cateringService';

export const useGetCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => cateringService.getCategories(),
    });
};

export const useGetCategoryById = (id: number) => {
    return useQuery({
        queryKey: ['categories', id],
        queryFn: () => cateringService.getCategoryById(id),
        enabled: !!id,
    });
};

export const useCreateCategory = () => {
    return useMutation({
        mutationFn: (data: Omit<Category, 'id'>) => cateringService.createCategory(data),
    });
};
