import { LngLat, LngLatBounds } from '@yandex/ymaps3-types';
import { handleFetch } from '../../serviceFuncs/handleFetch';
import { Feature, Meal, Restaurant, RestaurantsService, ReviewResponse, SearchSuggestion } from './restaurantsService';

type WorkingTime = {
    close_time: string;
    date: string;
    open_time: string;
    source: string;
    weekday: number;
};

type RestaurantFromServer = Omit<Restaurant, 'workingTime'> & { working_times: WorkingTime[] };

export class RestaurantsServiceReal implements RestaurantsService {
    private addWorkingTime(restaurants: RestaurantFromServer[]): Restaurant[] {
        const todaysDate = new Date().toISOString().split('T')[0];
        return restaurants.map((restaurant: RestaurantFromServer) => {
            const todaysWorkingTimes = restaurant.working_times.filter((time) => time.date === todaysDate)[0];
            const open = todaysWorkingTimes.open_time;
            const close = todaysWorkingTimes.close_time;
            const workingTime = open && close ? `${open}-${close}` : 'Закрыт';
            const newRestaurant = {
                ...restaurant,
                workingTime,
            };
            Reflect.deleteProperty(newRestaurant, 'working_times');
            return newRestaurant;
        });
    }
    async getRestaurants(bounds: LngLatBounds, userLocation: LngLat, ids: number[], types: string[]): Promise<{ data: Restaurant[] }> {
        let endpoint;
        if (ids.length > 0) {
            endpoint = `api/restaurants/?ids=${ids}&types=${types}`;
        } else {
            let userCoordinates;
            if (userLocation) {
                const [userLon, userLat] = userLocation;
                userCoordinates = `&usr_lat=${userLat}&usr_lon=${userLon}`;
            }
            const coords = bounds.flat();
            const swlat = `swlat=${coords[1]}`;
            const swlon = `swlon=${coords[0]}`;
            const nelat = `nelat=${coords[3]}`;
            const nelon = `nelon=${coords[2]}`;
            endpoint = `api/restaurants/?${swlat}&${swlon}&${nelat}&${nelon}${userLocation ? userCoordinates : ''} &types=${types}`;
        }
        const responseData = await handleFetch(endpoint);
        const restaurants = this.addWorkingTime(responseData.data);
        return { data: restaurants };
    }
    async getRestaurantById(id: number): Promise<{ data: Restaurant }> {
        const responseData = await handleFetch(`api/restaurants/${id}/`);
        const restaurant = this.addWorkingTime([responseData.data]);
        return { data: restaurant[0] };
    }
    async getMeals(restaurantId: number): Promise<{ data: Meal[] }> {
        return handleFetch(`api/restaurants/${restaurantId}/meals/`);
    }
    async getFeatures(restaurantId: number, mealId: number): Promise<{ data: Feature[] }> {
        return handleFetch(`api/restaurants/${restaurantId}/meals/${mealId}/features/`);
    }
    async getReviews(restaurantId: number): Promise<{ data: ReviewResponse }> {
        const limit = 100;
        const offset = 0;
        return handleFetch(`api/restaurants/${restaurantId}/reviews/?limit=${limit}&offset=${offset}`);
    }
    async getSearchSuggestions(searchQuery: string): Promise<{ data: SearchSuggestion[] }> {
        return handleFetch(`api/restaurants/search/?q=${searchQuery}`);
    }
}
