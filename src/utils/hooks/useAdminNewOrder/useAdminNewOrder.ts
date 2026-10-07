import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminNewOrderPayload, adminNewOrderService, adminNewOrderServiceMock, RegularClient } from '../../api/adminNewOrderService/adminNewOrderService';
import { useDebounce } from 'use-debounce';
import { useCurrentUser } from '../useCurrentUser/useCurretUser';

export const useGetAdminCategory = () => {
    return useQuery({
        queryKey: ['adminCategory'],
        queryFn: () => adminNewOrderServiceMock.getAdminCategory(),
    });
};

export const useGetAdminBasket = () => {
    const { isLogin } = useCurrentUser();
    return useQuery({
        queryKey: ['adminBasket'],
        queryFn: () => adminNewOrderService.getAdminBasket(),
        retry: false,
        enabled: isLogin,
    });
};

export const useEmptyAdminBasket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (basketId: number) => adminNewOrderService.emptyAdminBasket(basketId),
        onSuccess: () => queryClient.removeQueries({ queryKey: ['adminBasket'] }),
    });
};

export const useAddMealAdminBasket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ mealId, restaurantId, features }: { mealId: number; restaurantId: number; features: { featureId: number; choiceId: number }[] }) => adminNewOrderService.addMealAdminBasket(mealId, restaurantId, features),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};

export const useIncrementMealAdminBasket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ mealId }: { mealId: number }) => adminNewOrderService.incrementMealAdminBasket(mealId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};

export const useDecrementMealAdminBasket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ mealId }: { mealId: number }) => adminNewOrderService.decrementMealAdminBasket(mealId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminBasket'] }),
    });
};

export const useCreateAdminNewOrder = () => {
    return useMutation({
        mutationFn: ({ payload }: { payload: AdminNewOrderPayload }) => adminNewOrderService.createAdminNewOrder(payload),
    });
};

export const useSetAdminNewOrderPaid = () => {
    return useMutation({
        mutationFn: ({ orderId, isPaid }: { orderId: number; isPaid: boolean }) => adminNewOrderService.setAdminNewOrderPaid(orderId, isPaid),
    });
};

export const useGetAdminMeals = (restaurantId: number) => {
    return useQuery({
        queryKey: ['adminMeals', restaurantId],
        queryFn: () => adminNewOrderService.getAdminMeals(restaurantId!),
        enabled: !!restaurantId,
    });
};

export const useGetAdminFeatures = (restaurantId: number, mealId: number) => {
    return useQuery({
        queryKey: ['adminFeatures', restaurantId, mealId],
        queryFn: () => adminNewOrderService.getAdminFeatures(restaurantId!, mealId),
        enabled: restaurantId !== null && mealId !== null,
    });
};

export const useGetClientsByPhone = (phone: string) => {
    const digits = (phone ?? '').replace(/\D/g, '');
    const [debouncedSearch] = useDebounce(digits, 500);
    return useQuery({
        queryKey: ['regularClient', debouncedSearch],
        queryFn: () => adminNewOrderService.getClientsByPhone(debouncedSearch),
        enabled: debouncedSearch.length >= 8,
    });
};

export const useCreateRegularClient = () => {
    return useMutation({
        mutationFn: ({ data }: { data: Omit<RegularClient, 'id'> }) => adminNewOrderService.createRegularClient(data),
    });
};
