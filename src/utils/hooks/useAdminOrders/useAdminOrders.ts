import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminNewOrderPayload, AdminOrderStatus, adminService } from '../../api/adminService/adminService';

export const useGetAdminOrders = (status: AdminOrderStatus) => {
    return useQuery({
        queryKey: ['adminOrders', status],
        queryFn: () => adminService.getAdminOrders(status),
    });
};

export const useAdminOrdersMutations = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const queryClient = useQueryClient();
    const changeAdminOrderStatus = useMutation({
        mutationFn: ({ id, status }: { id: number; status: AdminOrderStatus }) => adminService.changeAdminOrderStatus(id, status),
        onSuccess: () =>
            queryClient.refetchQueries({
                queryKey: ['adminOrders'],
                type: 'active',
            }),
        onError: (error) => {
            setErrorMessage(error.message);
        },
    });
    return {
        changeAdminOrderStatus,
        errorMessage,
    };
};

export const useCreateAdminOrder = () => {
    return useMutation({
        mutationFn: ({ payload }: { payload: AdminNewOrderPayload }) => adminService.createAdminOrder(payload),
    });
};
