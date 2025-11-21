import { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import RestaurantPopup from './RestaurantPopup/RestaurantPopup';
import RestaurantImage from './RestaurantImage/RestaurantImage';
import RestaurantDescription from './RestaurantDescription/RestaurantDescription';
import MealsList from './MealsList/MealsList';
import MealsFilter from './MealsFilter/MealsFilter';
import Preloader from '../../../components/Preloader/Preloader';
import PageNotFound from '../../PageNotFound/PageNotFound';
import { Meal, MealType } from '../../../utils/api/restaurantsService/restaurantsService';
import styles from './RestaurantPopup/RestaurantPopup.module.scss';
import { useRestaurantsContext } from '../../../utils/hooks/useRestaurants/useRestaurantsContext';
import { useMeals } from '../../../utils/hooks/useMeals/useMeals';
import { useRestaurant } from '../../../utils/hooks/useRestaurant/useRestaurant';
import { useCurrentUser } from '../../../utils/hooks/useCurrentUser/useCurretUser';
import { useBasketMutations } from '../../../utils/hooks/useBasket/useBasket';
import { useReviews } from '../../../utils/hooks/useReviews/useReviews';
import Reviews from './Reviews/Reviews';

function Restaurant() {
    const [isMealPageOpen, setIsMealPageOpen] = useState(false);
    const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
    const [isReviewsVisible, setIsReviewsVisible] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const { isLogin } = useCurrentUser();
    const restaurantId = parseInt(params.restaurantId ? params.restaurantId : '');
    const { setActiveRestaurant } = useRestaurantsContext();
    const { data: restaurantData, isLoading: restaurantLoading, error: restaurantError, isSuccess: isRestaurantSuccess } = useRestaurant(restaurantId);
    const restaurant = isRestaurantSuccess && restaurantData.data;
    const { data, isPending: mealsLoading, isSuccess } = useMeals(restaurantId);
    const meals = isSuccess && data.data;
    const { addMeal } = useBasketMutations();
    const { data: reviewsData, isSuccess: isReviewsSuccess } = useReviews(restaurantId);
    const rating = isReviewsSuccess ? reviewsData.data.results.restaurant.rating : '';
    const reviewsCount = isReviewsSuccess ? `( ${reviewsData.data.count} )` : '';
    const reviews = isReviewsSuccess ? reviewsData.data.results.reviews : [];
    const handleAddMealClick = async (meal: Meal) => {
        if (isLogin && restaurant) {
            navigate(`meal/${meal.id}`);
            setIsMealPageOpen(true);
        } else {
            navigate(`/signin`);
        }
    };
    const handleReviewsClick = () => setIsReviewsVisible((prev) => !prev);
    const close = () => {
        navigate('/');
    };

    const addMealType = (mealType: MealType) => {
        setSelectedMealTypes([...selectedMealTypes, mealType]);
    };

    const deleteMealType = (mealType: MealType) => {
        setSelectedMealTypes(selectedMealTypes.filter((type) => type !== mealType));
    };
    useEffect(() => {
        if (restaurantId) {
            setActiveRestaurant(restaurantId);
        }
    }, [restaurantId, setActiveRestaurant]);
    if (restaurantLoading) {
        return (
            <div className={styles['restaurant-popup_overlay']}>
                <div className={styles['restaurant-popup']}>
                    <Preloader />
                </div>
            </div>
        );
    }

    if (restaurantError) {
        return <PageNotFound />;
    }

    if (!restaurant) {
        return null;
    }

    const mealsFiltered = meals && selectedMealTypes.length === 0 ? meals : meals ? meals.filter((meal) => selectedMealTypes.includes(meal.type)) : [];

    return (
        <>
            <RestaurantPopup close={close} isMealPageOpen={isMealPageOpen} setIsMealPageOpen={setIsMealPageOpen} restaurant={restaurant}>
                <RestaurantImage image={restaurant.photo} />
                <RestaurantDescription name={restaurant.name} address={restaurant.address} workingTime={restaurant.workingTime} rating={rating} reviews={reviewsCount} onReviews={handleReviewsClick} description={restaurant.description} />
                {isReviewsVisible ? (
                    <Reviews reviews={reviews} />
                ) : (
                    <>
                        <MealsFilter selectedTypes={selectedMealTypes} addType={addMealType} deleteType={deleteMealType} />
                        {mealsLoading ? <Preloader /> : <MealsList meals={mealsFiltered} handleClick={handleAddMealClick} isActive={addMeal.isPending} />}
                    </>
                )}
            </RestaurantPopup>
            <Outlet />
        </>
    );
}

export default Restaurant;
