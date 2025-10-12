import { useQuery, skipToken } from '@tanstack/react-query';
import { Restaurant, restaurantsService, SearchSuggestion } from '../../api/restaurantsService/restaurantsService';
import { LngLat, LngLatBounds } from '@yandex/ymaps3-types';
import { uniq } from 'lodash';
import { VenueType } from '../../../contexts/RestaurantsContext';
import { useRef } from 'react';

export const useRestaurants = (bounds: LngLatBounds, userLocation: LngLat, selectedOptions: SearchSuggestion[], selectedVenueTypes: VenueType[]) => {
    const cachedFilteredRestaurants = useRef<Restaurant[] | []>([]);
    const ids = uniq(selectedOptions.map((item) => item.restaurant_ids).flat());
    const types = selectedVenueTypes.map((item) => item.name);
    const { isLoading, isError, data, refetch } = useQuery({
        queryKey: ['restaurants', bounds, userLocation, ids, types],
        queryFn: bounds.length > 0 ? () => restaurantsService.getRestaurants(bounds as LngLatBounds, userLocation as LngLat, ids, types) : skipToken,
    });
    if (data) {
        cachedFilteredRestaurants.current = data.data;
    }
    return {
        isLoading,
        isError,
        restaurantsOnMap: cachedFilteredRestaurants.current,
        refetch,
    };
};
