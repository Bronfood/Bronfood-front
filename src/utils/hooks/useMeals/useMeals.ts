import { useQuery } from '@tanstack/react-query';
import { MealFilters, restaurantsService } from '../../api/restaurantsService/restaurantsService';

export const useMeals = (restaurantId: number, filters: MealFilters = {}) => {
    return useQuery({
        queryKey: ['meals', restaurantId, filters],
        queryFn: () => restaurantsService.getMeals(restaurantId, filters),
    });
};
