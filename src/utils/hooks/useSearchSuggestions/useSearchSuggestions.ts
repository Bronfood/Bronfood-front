import { useQuery } from '@tanstack/react-query';
import { restaurantsService } from '../../api/restaurantsService/restaurantsService';
import { useDebounce } from 'use-debounce';

export const useSearchSuggestions = (searchQuery: string) => {
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
    return useQuery({
        queryKey: ['search suggestions', debouncedSearchQuery],
        queryFn: () => restaurantsService.getSearchSuggestions(debouncedSearchQuery),
    });
};
