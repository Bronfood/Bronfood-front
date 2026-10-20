import Preloader from '../../../../components/Preloader/Preloader';
import styles from './MealStep.module.scss';
import CategoryFilter from '../../../../components/CategoryFilter/CategoryFilter';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import AdminMealCard from '../../../../components/Cards/AdminMealCard/AdminMealCard';
import { useNavigate } from 'react-router-dom';
import { useAddAdminMeal, useIncrementAdminMeal } from '../../../../utils/hooks/useAdminBasket/useAdminBasket';
import { useAdminOrderContext } from '../../../../utils/hooks/useAdminOrders/useAdminOrderContext';
import { useMeals } from '../../../../utils/hooks/useMeals/useMeals';
import { useGetAdminCategories } from '../../../../utils/hooks/useAdminCategory/useAdminCategory';
import { Category } from '../../../../utils/api/categoryService/categoryService';
import { MealFilters } from '../../../../utils/api/restaurantsService/restaurantsService';

function MealStep() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showPopular, setShowPopular] = useState(false);
    const [showFavorite, setShowFavorite] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { restaurantId, isClientDataValid, clientData } = useAdminOrderContext();
    const clientId = clientData.client_id;
    const numericRestaurantId = Number(restaurantId);
    const filters: MealFilters = {
        popular: showPopular ? true : undefined,
        favorite: showFavorite && clientId ? { clientId } : undefined,
        categoryIds: selectedIds.length > 0 ? selectedIds : undefined,
    };
    const { data: meals, isLoading: isLoadingMeals, error: errorMeals } = useMeals(numericRestaurantId, filters);
    const { data: categoriesData, isLoading: isLoadingCategories } = useGetAdminCategories(numericRestaurantId);
    const { mutateAsync: increment } = useIncrementAdminMeal();
    const { mutateAsync: addMeal } = useAddAdminMeal();

    const errorMessage = errorMeals ? getErrorMessage(errorMeals, 'pages.admin.') : '';
    const categories: Category[] = categoriesData?.data ?? [];

    const renderErrorMessage = (error: string) => {
        return (
            <div style={{ padding: '0 20px' }}>
                <ErrorMessage message={error} />
            </div>
        );
    };

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
        } catch (error) {
            setError(getErrorMessage(error as Error, 'pages.admin.'));
        }
    };

    const hasFilters = selectedIds.length > 0 || showPopular || showFavorite;
    const mealsList = meals?.data ?? [];

    useEffect(() => {
        if (!isClientDataValid) {
            navigate('/manager/new-order/client-step', { replace: true });
        }
    }, [isClientDataValid, navigate]);

    return (
        <>
            {(isLoadingMeals || isLoadingCategories) && <Preloader />}
            {!isLoadingMeals && mealsList.length === 0 && !hasFilters && <p className={styles['meal__empty']}>{t('pages.admin.noAvailableMeal')}</p>}
            {!isLoadingMeals && mealsList.length === 0 && hasFilters && <p className={styles['stock__empty']}>{t('pages.admin.noMealsInTheSelectedCategories')}</p>}
            {mealsList.length > 0 && (
                <ul className={styles['meal__list']}>
                    {mealsList.map((meal) => (
                        <li key={meal.id}>
                            <AdminMealCard meal={meal} restaurantId={numericRestaurantId} onAdd={(id, features) => handleAddMeal(id, 1, features)} onAddCount={handleAddMeal} />
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
                    customFilters={[
                        { name: 'popular', text: t('pages.admin.popular'), selected: showPopular, onSelect: () => setShowPopular(true), onDeselect: () => setShowPopular(false) },
                        { name: 'favorite', text: t('pages.admin.favorite'), selected: showFavorite, onSelect: () => setShowFavorite(true), onDeselect: () => setShowFavorite(false) },
                    ]}
                />
            </div>

            {error && renderErrorMessage(error)}
            {errorMessage && renderErrorMessage(errorMessage)}
        </>
    );
}

export default MealStep;
