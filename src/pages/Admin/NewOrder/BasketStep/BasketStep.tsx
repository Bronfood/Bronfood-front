import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import Preloader from '../../../../components/Preloader/Preloader';
import styles from './BasketStep.module.scss';
import { Navigate, useNavigate } from 'react-router-dom';
import Counter from '../../../../components/Counter/Counter';
import { useEffect, useState } from 'react';
import AdminMealCard from '../../../../components/Cards/AdminMealCard/AdminMealCard';
import { useDecrementAdminMeal, useGetAdminBasket, useIncrementAdminMeal } from '../../../../utils/hooks/useAdminBasket/useAdminBasket';
import { useAdminOrderContext } from '../../../../utils/hooks/useAdminOrders/useAdminOrderContext';

function BasketStep() {
    const { restaurantId, isClientDataValid } = useAdminOrderContext();
    const { data: basket, isLoading: isLoadingBasket, error: basketError } = useGetAdminBasket();
    const { mutateAsync: increment, isPending: isPendingIncrement, error: incrementError } = useIncrementAdminMeal();
    const { mutateAsync: decrement, isPending: isPendingDecrement, error: decrementError } = useDecrementAdminMeal();
    const navigate = useNavigate();
    const error = basketError || decrementError || incrementError;
    const errorMessage = error ? getErrorMessage(error, 'pages.admin.') : '';
    const is404 = errorMessage === 'pages.admin.basketNotFound';

    const [errorCatch, setErrorCatch] = useState<string | null>(null);

    const handleIncrementMeal = async (mealId: number) => {
        await increment({ mealId });
    };

    const handleDecrementMeal = async (basketMealId: number, count: number = 1) => {
        try {
            await decrement({ mealId: basketMealId });
            if (count > 1) {
                for (let i = 1; i < count; i++) {
                    await decrement({ mealId: basketMealId });
                }
            }
        } catch (error) {
            setErrorCatch(getErrorMessage(error as Error, 'pages.admin.'));
        }
    };

    const renderErrorMessage = (error: string) => {
        return (
            <div style={{ padding: '0 20px' }}>
                <ErrorMessage message={error} />
            </div>
        );
    };

    useEffect(() => {
        if (is404 || !isClientDataValid) {
            navigate('/manager/new-order/meal-step', { replace: true });
        }
    }, [is404, isClientDataValid, navigate]);

    if (is404) return null;
    if (basket?.data?.meals?.length === 0) return <Navigate to="/manager/new-order/meal-step" replace />;
    if (!basket?.data) return null;

    return (
        <>
            {(isLoadingBasket || isPendingIncrement || isPendingDecrement) && (
                <div className={styles['basket__preloader']}>
                    <Preloader />
                </div>
            )}
            {basket?.data.meals.length > 0 && restaurantId && (
                <ul className={styles['basket__list']}>
                    {basket.data.meals.map((item) => (
                        <li key={item.meal.id}>
                            <AdminMealCard meal={item.meal} restaurantId={restaurantId} onDelete={() => handleDecrementMeal(item.id, item.count)} isBascket={true} counter={<Counter count={item.count} increment={() => handleIncrementMeal(item.id)} decrement={() => handleDecrementMeal(item.id)} />} />
                        </li>
                    ))}
                </ul>
            )}
            {error && renderErrorMessage(errorMessage)}
            {errorCatch && renderErrorMessage(errorCatch)}
        </>
    );
}

export default BasketStep;
