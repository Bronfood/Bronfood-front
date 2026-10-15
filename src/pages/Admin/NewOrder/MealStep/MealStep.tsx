import Preloader from '../../../../components/Preloader/Preloader';
import { useAddMealAdminBasket, useGetAdminMeals, useIncrementMealAdminBasket } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrder';
import styles from './MealStep.module.scss';
import CategoryFilter from '../../../../components/CategoryFilter/CategoryFilter';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import { useAdminNewOrderContext } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrderContext';
import AdminMealCard from '../../../../components/Cards/AdminMealCard/AdminMealCard';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../../../utils/hooks/useRestaurant/useRestaurant';

function MealStep() {
    const { t } = useTranslation();

    const { restaurantId, isClientDataValid } = useAdminNewOrderContext();
    const { data: meals, isLoading: isLoadingMeals, error } = useGetAdminMeals(Number(restaurantId));
    const { data: restaurant, isLoading: isLoadingCategories } = useRestaurant(Number(restaurantId));
    const { mutateAsync: increment } = useIncrementMealAdminBasket();
    const { mutateAsync: addMeal } = useAddMealAdminBasket();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showUncategorized, setShowUncategorized] = useState(false);
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';
    const navigate = useNavigate();
    const categories = restaurant?.data.categories || [];

    const handleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const handleDeselect = (id: number) => {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const handleAddMeal = async (mealId: number, count: number = 1, features: { featureId: number; choiceId: number }[] = []) => {
        if (restaurantId == null) return;

        try {
            const result = await addMeal({ mealId, restaurantId, features });
            const basketMealId = result.data.id;

            if (count > 1) {
                await Promise.all(Array.from({ length: count - 1 }, () => increment({ mealId: basketMealId })));
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!isClientDataValid) {
            navigate('/manager/new-order/client-step', { replace: true });
        }
    }, [isClientDataValid, navigate]);

    if (isLoadingMeals || isLoadingCategories) return <Preloader />;
    if (error) {
        return (
            <div style={{ padding: '0 20px' }}>
                <ErrorMessage message={errorMessage} />
            </div>
        );
    }
    if (!meals?.data) return null;
    if (restaurantId == null) return null;

    const filteredMeals =
        selectedIds.length > 0 || showUncategorized
            ? meals.data.filter((meal) => {
                  if (meal.category) return selectedIds.includes(meal.category.id);
                  return showUncategorized;
              })
            : meals.data;

    return (
        <>
            {filteredMeals.length === 0 ? (
                <p className={styles['meal__empty']}>{t('pages.admin.noMealsInTheSelectedCategories')}</p>
            ) : (
                <ul className={styles['meal__list']}>
                    {filteredMeals.map((meal) => (
                        <li key={meal.id}>
                            <AdminMealCard meal={meal} restaurantId={restaurantId} onAdd={(id, features) => handleAddMeal(id, 1, features)} onAddCount={handleAddMeal} />
                        </li>
                    ))}
                </ul>
            )}

            <div className={styles['meal__category-filter']}>
                <CategoryFilter
                    categories={categories}
                    selectedIds={selectedIds}
                    select={handleSelect}
                    deselect={handleDeselect}
                    uncategorized={{
                        selected: showUncategorized,
                        onSelect: () => setShowUncategorized(true),
                        onDeselect: () => setShowUncategorized(false),
                    }}
                />
            </div>
        </>
    );
}

export default MealStep;
