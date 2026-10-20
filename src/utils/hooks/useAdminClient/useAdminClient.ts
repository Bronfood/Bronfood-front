import { useMutation, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { adminClientService, RegularClient } from '../../api/adminClientService/adminClientService';

export const useGetClientsByPhone = (phone: string) => {
    const digits = (phone ?? '').replace(/\D/g, '');
    const [debouncedSearch] = useDebounce(digits, 500);
    return useQuery({
        queryKey: ['regularClient', debouncedSearch],
        queryFn: () => adminClientService.getClientsByPhone(debouncedSearch),
        enabled: debouncedSearch.length >= 8,
    });
};

export const useCreateRegularClient = () => {
    return useMutation({
        mutationFn: ({ data }: { data: Omit<RegularClient, 'id'> }) => adminClientService.createRegularClient(data),
    });
};
