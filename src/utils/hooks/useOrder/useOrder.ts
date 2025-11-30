import { useState, useEffect } from 'react';
import { UseQueryOptions, useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { orderService, OrderState, UserOrdersListPagination } from '../../api/orderService/orderService';
import i18n from 'i18next';

export const useOrderData = (userId: number | null, placedOrder: OrderState | null) => {
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [preparationTime, setPreparationTime] = useState<number | null>(null);
    const [cancellationTime, setCancellationTime] = useState<number | null>(null);

    useEffect(() => {
        if (placedOrder) {
            setPreparationTime(placedOrder.preparationTime);
            setCancellationTime(placedOrder.cancellationTime);
        }
    }, [placedOrder]);

    const {
        mutate: cancelOrderMutate,
        isPending: isCancelOrderPending,
        isSuccess: isCancelOrderSuccess,
    } = useMutation({
        mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', userId] });
        },
        onError: (error) => {
            const errorMsg = typeof error === 'string' ? error : i18n.t('errors.anUnexpectedErrorHasOccurred');
            setErrorMessage(errorMsg);
        },
    });

    const queryOptions: UseQueryOptions<'confirmed' | 'waiting' | 'notConfirmed' | null> = {
        queryKey: ['checkPreparationStatus', placedOrder?.id],
        queryFn: async () => {
            const response = await orderService.checkPreparationStatus(placedOrder?.id ?? '');
            if (response.status === 'success') {
                return response.data[0].preparationStatus;
            } else {
                throw new Error(response.error_message);
            }
        },
        enabled: !!userId && !!placedOrder,
        refetchInterval: 10000,
    };

    const { data: preparationStatus, error: statusError, isFetching: isQueryFetching } = useQuery(queryOptions);

    useEffect(() => {
        if (statusError) {
            const errorMsg = typeof statusError === 'string' ? statusError : i18n.t('errors.anUnexpectedErrorHasOccurred');
            setErrorMessage(errorMsg);
        }
    }, [statusError]);

    const isLoading = isQueryFetching || isCancelOrderPending;

    return {
        preparationTime,
        setPreparationTime,
        cancellationTime,
        setCancellationTime,
        cancelOrder: {
            mutate: cancelOrderMutate,
            isPending: isCancelOrderPending,
            isSuccess: isCancelOrderSuccess,
        },
        errorMessage: errorMessage || statusError,
        isLoading,
        preparationStatus,
        placedOrder,
    };
};

export const useUserOrders = (limit: number) => {
    return useInfiniteQuery<UserOrdersListPagination, Error>({
        queryKey: ['userOrders', limit],
        queryFn: ({ pageParam = 0 }) => orderService.getUserOrders(limit, pageParam as number).then((response) => response.data),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage.next) return;
            return parseInt(new URL(lastPage.next).searchParams.get('offset') ?? '0');
        },
    });
};
