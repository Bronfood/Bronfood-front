import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import Preloader from '../../../../components/Preloader/Preloader';
import styles from './BasketStep.module.scss';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDecrementMealAdminBasket, useEmptyAdminBasket, useGetAdminBasket, useIncrementMealAdminBasket } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrder';
import Counter from '../../../../components/Counter/Counter';
import { useEffect } from 'react';
import { useAdminNewOrderContext } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrderContext';
import AdminMealCard from '../../../../components/Cards/AdminMealCard/AdminMealCard';

function BasketStep() {
    const { restaurantId, isClientDataValid } = useAdminNewOrderContext();
    const { data: basket, error, isLoading } = useGetAdminBasket();
    const { mutateAsync: emptyBasket } = useEmptyAdminBasket();
    const { mutateAsync: increment } = useIncrementMealAdminBasket();
    const { mutateAsync: decrement } = useDecrementMealAdminBasket();
    const navigate = useNavigate();
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';
    const is404 = errorMessage === 'pages.cateringManagement.basketNotFound';

    const handleEmptyBasket = async (basketId: number) => {
        await emptyBasket(basketId);
        navigate('/manager/new-order/food');
    };

    const handleIncrementMeal = async (mealId: number) => {
        await increment({ mealId });
    };

    const handleDecrementMeal = async (mealId: number) => {
        await decrement({ mealId });
    };

    useEffect(() => {
        if (is404 || !isClientDataValid) {
            navigate('/manager/new-order/meal-step', { replace: true });
        }
    }, [is404, isClientDataValid, navigate]);

    if (restaurantId === null) return <Navigate to="/signin" replace />;
    if (is404) return null;
    if (basket?.data?.meals?.length === 0) return <Navigate to="/manager/new-order/food" replace />;
    if (isLoading) return <Preloader />;
    if (error) {
        return (
            <div style={{ padding: '0 20px' }}>
                <ErrorMessage message={errorMessage} />
            </div>
        );
    }
    if (!basket?.data) return null;

    return (
        <ul className={styles['basket__list']}>
            {basket.data.meals.map((item) => (
                <li key={item.meal.id}>
                    <AdminMealCard meal={item.meal} restaurantId={restaurantId} onDelete={() => handleEmptyBasket(basket.data.id)} isBascket={true} counter={<Counter count={item.count} increment={() => handleIncrementMeal(item.id)} decrement={() => handleDecrementMeal(item.id)} />} />
                </li>
            ))}
        </ul>
    );
}

export default BasketStep;
