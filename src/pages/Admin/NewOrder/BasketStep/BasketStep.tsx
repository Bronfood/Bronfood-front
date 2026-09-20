import BasketCardItem from './BasketCardItem/BasketCardItem';
import { useTranslation } from 'react-i18next';
import { useDeleteMealInBasket, useGetAdminBasket } from '../../../../utils/hooks/useAdminBasket/useAdminBasket';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import Preloader from '../../../../components/Preloader/Preloader';
import Button from '../../../../components/Button/Button';
import styles from './BasketStep.module.scss';

function BasketStep() {
    const { t } = useTranslation();
    const { data: data, isLoading } = useGetAdminBasket();
    const { mutateAsync: deleteFood, error, isPending } = useDeleteMealInBasket();
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const handleDeleteFood = async (mealId: number) => {
        await deleteFood({ mealId });
    };

    return (
        <>
            {(isLoading || isPending) && <Preloader />}
            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}
            {data?.data && data.data.meals.length > 0 ? (
                <div className={styles['basket__list']}>
                    <ul>
                        {data.data.meals.map((food) => (
                            <li key={food.id}>
                                <BasketCardItem food={food} onDelete={handleDeleteFood} />
                            </li>
                        ))}
                    </ul>

                    <div className={styles['basket__total']}>
                        <p>{t('pages.admin.total')}</p>
                        <p className={styles['basket__total_price']}>{`${data?.data.total} ₸`}</p>
                    </div>
                    <Button>
                        {t('pages.admin.createOrderForPayment')} {`${data?.data.total} ₸`}
                    </Button>
                </div>
            ) : (
                <p className={styles['basket__empty']}>{t('pages.admin.noАddedMeals')}</p>
            )}
        </>
    );
}

export default BasketStep;
