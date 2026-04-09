import { useMutation, useQuery } from '@tanstack/react-query';
import { Category, categoryService } from '../../api/categoryService/categoryService';

export const useGetCategories = (cateringId: number) => {
    return useQuery({
        queryKey: ['categories', cateringId],
        queryFn: () => categoryService.getCategories(cateringId),
    });
};

export const useGetCategoryById = (cateringId: number, categoryId: number) => {
    return useQuery({
        queryKey: ['categories', cateringId, categoryId],
        queryFn: () => categoryService.getCategoryById(cateringId, categoryId),
        enabled: !!cateringId && !!categoryId,
    });
};

export const useCreateCategory = () => {
    return useMutation({
        mutationFn: ({ cateringId, data }: { cateringId: number; data: Omit<Category, 'id'> }) => categoryService.createCategory(cateringId, data),
    });
};

export const useDeleteCategory = () => {
    return useMutation({
        mutationFn: ({ cateringId, categoryId }: { cateringId: number; categoryId: number }) => categoryService.deleteCategory(cateringId, categoryId),
    });
};

export const useUpdateCategory = () => {
    return useMutation({
        mutationFn: ({ cateringId, data }: { cateringId: number; data: Partial<Category> & { categoryId: number } }) => categoryService.updateCategory(cateringId, data),
    });
};
