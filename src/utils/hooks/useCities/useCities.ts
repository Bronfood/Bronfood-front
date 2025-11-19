import { useQuery } from '@tanstack/react-query';
import { mapService } from '../../api/mapService/mapService';

export const useCities = () => {
    return useQuery({
        queryKey: ['cities'],
        queryFn: () => mapService.getCities(),
        staleTime: Infinity,
    });
};
