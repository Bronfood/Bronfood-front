import Preloader from '../../../../components/Preloader/Preloader';
import { useAddMealAdminBasket, useGetAdminCategory, useGetAdminMeals, useIncrementMealAdminBasket } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrder';
import styles from './MealStep.module.scss';
import CategoryFilter from '../../../../components/CategoryFilter/CategoryFilter';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import { useAdminNewOrderContext } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrderContext';
import AdminMealCard from '../../../../components/Cards/AdminMealCard/AdminMealCard';
import { useNavigate } from 'react-router-dom';

function MealStep() {
    const { t } = useTranslation();

    const { restaurantId, isClientDataValid } = useAdminNewOrderContext();
    const { data: meals, isLoading: isLoadingMeals, error } = useGetAdminMeals(Number(restaurantId));
    const { data: categories, isLoading: isLoadingCategories } = useGetAdminCategory();
    const { mutateAsync: increment } = useIncrementMealAdminBasket();
    const { mutateAsync: addMeal } = useAddMealAdminBasket();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showUncategorized, setShowUncategorized] = useState(false);
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';
    const navigate = useNavigate();

    const handleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const handleDeselect = (id: number) => {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const handleAddCount = async (mealId: number, count: number) => {
        if (restaurantId == null) return;
        const result = await addMeal({ mealId, restaurantId, features: [] });
        const basketMealId = result.data.id;
        for (let i = 1; i < count; i++) {
            await increment({ mealId: basketMealId });
        }
    };

    const handleClickAdd = async (mealId: number) => {
        if (restaurantId == null) return;
        await addMeal({
            mealId: mealId,
            restaurantId,
            features: [],
        });
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
                            <AdminMealCard meal={meal} restaurantId={restaurantId} onAdd={handleClickAdd} onAddCount={handleAddCount} />
                        </li>
                    ))}
                </ul>
            )}

            <div className={styles['meal__category-filter']}>
                <CategoryFilter
                    categories={categories?.data}
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
