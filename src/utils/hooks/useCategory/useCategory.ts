import { useMutation, useQuery } from '@tanstack/react-query';
import { Category, cateringServiceMock } from '../../api/cateringService/cateringService';

export const useGetCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => cateringServiceMock.getCategories(),
    });
};

export const useGetCategoryById = (id: number) => {
    return useQuery({
        queryKey: ['categories', id],
        queryFn: () => cateringServiceMock.getCategoryById(id),
        enabled: !!id,
    });
};

export const useCreateCategory = () => {
    return useMutation({
        mutationFn: (data: Omit<Category, 'id'>) => cateringServiceMock.createCategory(data),
    });
};
