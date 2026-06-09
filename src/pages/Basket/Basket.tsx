import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Preloader from '../../components/Preloader/Preloader';
import { useCurrentUser } from '../../utils/hooks/useCurrentUser/useCurretUser';
import BasketConfirmation from './BasketConfirmation/BasketConfirmation';
import BasketDescription from './BasketDescription/BasketDescription';
import BasketEmpty from './BasketEmpty/BasketEmpty';
import BasketMealsList from './BasketMealsList/BasketMealsList';
import BasketPopup from './BasketPopup/BasketPopup';
import BasketRestaurant from './BasketRestaurant/BasketRestaurant';
import BasketTotal from './BasketTotal/BasketTotal';
import { useBasketMutations, useGetBasket } from '../../utils/hooks/useBasket/useBasket';
import { Restaurant } from '../../utils/api/restaurantsService/restaurantsService';
import { MealInBasket } from '../../utils/api/basketService/basketService';
import { usePaymentMutations } from '../../utils/hooks/usePayment/usePayment';

function Basket() {
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { getPaymentToken } = usePaymentMutations();
    const { addMeal, emptyBasket, errorMessage, reset, placeOrder } = useBasketMutations();
    const { data, isSuccess } = useGetBasket();
    const restaurant: Restaurant | Record<string, never> = isSuccess ? data.data.restaurant : {};
    const meals: MealInBasket[] = isSuccess ? data.data.meals : [];
    const waitingTime = meals.some((meal) => meal.count > 0) ? Math.max(...meals.map(({ meal, count }) => (count > 0 ? meal.waitingTime : 0))) : 0;
    const isEmpty = Object.keys(restaurant).length === 0;
    const price = isSuccess ? data.data.basket_price : 0;
    const isLoading = addMeal.isPending || emptyBasket.isPending;
    const { currentUser } = useCurrentUser();
    const userId = currentUser?.id;
    const restaurantId = restaurant.id;
    const close = () => {
        reset();
        navigate('/');
    };
    useEffect(() => {
        if (placeOrder.data) {
            const order = placeOrder.data;
            navigate('/waiting-order', { state: { order } });
        }
    }, [placeOrder, navigate]);
    const handlePayOrder = async () => {
        const orderDescription = meals.map((meal) => meal.meal.name).join(', ');
        const payment = await getPaymentToken.mutateAsync({ amount: price * 100, description: orderDescription });
        window.location.href = payment.checkout.redirect_url;
        if (userId) {
            await placeOrder.mutate({ userId, restaurantId });
        }
    };
    return (
        <>
            <BasketPopup close={close} isConfirmationPopupOpen={isConfirmationPopupOpen}>
                {isEmpty ? (
                    <BasketEmpty />
                ) : (
                    <>
                        <BasketDescription waitingTime={waitingTime}>{restaurant && <BasketRestaurant restaurant={restaurant} emptyBasket={() => setIsConfirmationPopupOpen(true)} />}</BasketDescription>
                        {errorMessage && <ErrorMessage message={t(`pages.basket.${errorMessage}`)} />}
                        <BasketMealsList meals={meals} />
                        <BasketTotal price={price} onPayOrderClick={handlePayOrder} />
                    </>
                )}
                {isLoading && <Preloader />}
            </BasketPopup>
            {isConfirmationPopupOpen && <BasketConfirmation close={() => setIsConfirmationPopupOpen(false)} />}
        </>
    );
}

export default Basket;
