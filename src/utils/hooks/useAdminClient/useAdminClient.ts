import { useMutation, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { adminClientService } from '../../api/adminClientService/adminClientService';
import { toPhoneSearchQuery } from '../../serviceFuncs/formatPhoneNumber';

export const useGetClientsByPhone = (phone: string) => {
    const query = toPhoneSearchQuery(phone);
    const [debouncedSearch] = useDebounce(query, 500);
    const digitsCount = debouncedSearch.replace(/\D/g, '').length;

    return useQuery({
        queryKey: ['regularClient', debouncedSearch],
        queryFn: () => adminClientService.getClientsByPhone(debouncedSearch),
        enabled: digitsCount >= 8,
    });
};

export const useCreateRegularClient = () => {
    return useMutation({
        mutationFn: ({ data }: { data: { phone: string; name?: string } }) => adminClientService.createRegularClient(data),
    });
};
