import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeService, PayoutRequisitesCatering } from '../../api/financeService/financeService';

export const useGetPayoutRequisites = () => {
    return useQuery({
        queryKey: ['cateringPayoutRequisites'],
        queryFn: () => financeService.getPayoutRequisites(),
    });
};

export const useUpdatePayoutRequisites = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<PayoutRequisitesCatering, 'bank_name'>) => financeService.updatePayoutRequisites(data),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['cateringPayoutRequisites'] });
        },
    });
};

export const useGetWallet = () => {
    return useQuery({
        queryKey: ['cateringWallet'],
        queryFn: () => financeService.getWallet(),
    });
};

export const useRefillWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: number) => financeService.refillWallet(payload),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['cateringWallet'] });
        },
    });
};

export const useGetPaymentRequisitesCards = () => {
    return useQuery({
        queryKey: ['cateringRequisitesCards'],
        queryFn: () => financeService.getPaymentRequisitesCards(),
    });
};

export const useGetPaymentRequisitesCardById = (requisitesCardId: number) => {
    return useQuery({
        queryKey: ['cateringRequisitesCards', requisitesCardId],
        queryFn: () => financeService.getPaymentRequisitesCardById(requisitesCardId),
        enabled: !!requisitesCardId,
    });
};

export const useDeletePaymentRequisitesCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (requisitesCardId: number) => financeService.deletePaymentRequisitesCard(requisitesCardId),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['cateringRequisitesCards'] });
        },
    });
};
