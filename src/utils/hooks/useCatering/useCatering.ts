import { useMutation, useQuery } from '@tanstack/react-query';
import { cateringService } from '../../api/cateringService/cateringService';

export const useGetCaterings = () => {
    return useQuery({
        queryKey: ['caterings'],
        queryFn: () => cateringService.getCaterings(),
    });
};

export const useGetCateringById = (cateringId: number) => {
    return useQuery({
        queryKey: ['caterings', cateringId],
        queryFn: () => cateringService.getCateringById(cateringId),
        enabled: !!cateringId,
    });
};

export const useCreateCatering = () => {
    return useMutation({
        mutationFn: (data: FormData) => cateringService.createCatering(data),
    });
};

export const useDeleteCatering = () => {
    return useMutation({
        mutationFn: (cateringId: number) => cateringService.deleteCatering(cateringId),
    });
};

export const useUpdateCatering = () => {
    return useMutation({
        mutationFn: ({ cateringId, data }: { cateringId: number; data: FormData }) => cateringService.updateCatering(cateringId, data),
    });
};
