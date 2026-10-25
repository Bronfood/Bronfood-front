import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import Preloader from '../../../../components/Preloader/Preloader';
import styles from './BasketStep.module.scss';
import { useNavigate } from 'react-router-dom';
import Counter from '../../../../components/Counter/Counter';
import { useEffect } from 'react';
import AdminMealCard from '../../../../components/Cards/AdminMealCard/AdminMealCard';
import { useDecrementAdminMeal, useDeleteAdminBasketPosition, useGetAdminBasket, useIncrementAdminMeal } from '../../../../utils/hooks/useAdminBasket/useAdminBasket';
import { useAdminOrderContext } from '../../../../utils/hooks/useAdminOrders/useAdminOrderContext';

function BasketStep() {
    const navigate = useNavigate();

    const { restaurantId, isClientDataValid } = useAdminOrderContext();
    const { data: basket, isLoading: isLoadingBasket, error: basketError } = useGetAdminBasket();
    const { mutate: increment, isPending: isPendingIncrement, error: incrementError } = useIncrementAdminMeal();
    const { mutate: decrement, isPending: isPendingDecrement, error: decrementError } = useDecrementAdminMeal();
    const { mutate: deletePosition, isPending: isPendingDelete, error: deleteError } = useDeleteAdminBasketPosition();

    const error = deleteError || decrementError || incrementError || basketError;
    const errorMessage = error ? getErrorMessage(error, 'pages.admin.') : '';
    const is404 = errorMessage === 'pages.admin.basketNotFound';

    const meals = basket?.data?.meals ?? [];
    const isBasketEmpty = !isLoadingBasket && basket?.data != null && meals.length === 0;

    useEffect(() => {
        if (!isClientDataValid) {
            navigate('/manager/new-order/client-step', { replace: true });
            return;
        }
        if (is404 || isBasketEmpty) {
            navigate('/manager/new-order/meal-step', { replace: true });
        }
    }, [is404, isBasketEmpty, isClientDataValid, navigate]);

    if (is404) return null;

    return (
        <>
            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}

            {(isLoadingBasket || isPendingIncrement || isPendingDecrement || isPendingDelete) && (
                <div className={styles['basket__preloader']}>
                    <Preloader />
                </div>
            )}

            {meals.length > 0 && restaurantId != null && (
                <ul className={styles['basket__list']}>
                    {meals.map((item) => (
                        <li key={item.id}>
                            <AdminMealCard meal={item.meal} basketItem={item} restaurantId={restaurantId} onDelete={() => deletePosition({ basketMealId: item.id, count: item.count })} isBascket={true} counter={<Counter count={item.count} increment={() => increment({ basketMealId: item.id })} decrement={() => decrement({ basketMealId: item.id })} />} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default BasketStep;
