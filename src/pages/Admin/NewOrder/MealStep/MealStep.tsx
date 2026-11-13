import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import { useNavigate } from 'react-router-dom';
import { useAddAdminMeal } from '../../../../utils/hooks/useAdminBasket/useAdminBasket';
import { useAdminOrderContext } from '../../../../utils/hooks/useAdminOrders/useAdminOrderContext';
import { useMeals } from '../../../../utils/hooks/useMeals/useMeals';
import { useGetAdminCategories } from '../../../../utils/hooks/useAdminCategory/useAdminCategory';
import { Category } from '../../../../utils/api/categoryService/categoryService';
import { MealFilters } from '../../../../utils/api/restaurantsService/restaurantsService';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import AdminMealCard from '../../../../components/Cards/AdminMealCard/AdminMealCard';
import Preloader from '../../../../components/Preloader/Preloader';
import CategoryFilter from '../../../../components/CategoryFilter/CategoryFilter';
import styles from './MealStep.module.scss';

function MealStep() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { restaurantId, isClientDataValid, clientData } = useAdminOrderContext();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showPopular, setShowPopular] = useState(false);
    const [showFavorite, setShowFavorite] = useState(false);

    const clientId = clientData.client_id;
    const isFavoriteActive = showFavorite && clientId != null;
    const filters: MealFilters = {
        popular: showPopular ? true : undefined,
        favorite: isFavoriteActive ? { clientId } : undefined,
        categoryIds: selectedIds.length > 0 ? selectedIds : undefined,
    };

    const customFilters = [{ name: 'popular', text: t('pages.admin.popular'), selected: showPopular, onSelect: () => setShowPopular(true), onDeselect: () => setShowPopular(false) }, ...(clientId != null ? [{ name: 'favorite', text: t('pages.admin.favorite'), selected: showFavorite, onSelect: () => setShowFavorite(true), onDeselect: () => setShowFavorite(false) }] : [])];

    const { data: meals, isLoading: isLoadingMeals, error: errorMeals } = useMeals(restaurantId, filters);
    const { data: categoriesData, isLoading: isLoadingCategories, error: errorCategories } = useGetAdminCategories(restaurantId);
    const { mutate: addMeal, isPending: isPendingAddMeal, error: addMealError } = useAddAdminMeal();

    const categories: Category[] = categoriesData?.data ?? [];
    const mealsList = meals?.data ?? [];
    const error = errorMeals || errorCategories || addMealError;
    const errorMessage = error ? getErrorMessage(error, 'pages.admin.') : '';
    const hasFilters = selectedIds.length > 0 || showPopular || isFavoriteActive;
    const isEmpty = !isLoadingMeals && !errorMeals && mealsList.length === 0;

    const handleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const handleDeselect = (id: number) => {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const handleAddMeal = (mealId: number, count: number = 1, features: { featureId: number; choiceId: number }[] = []) => {
        if (restaurantId == null) return;
        addMeal({ mealId, restaurantId, features, count });
    };

    useEffect(() => {
        if (!isClientDataValid) {
            navigate('/manager/new-order/client-step', { replace: true });
        }
    }, [isClientDataValid, navigate]);

    return (
        <>
            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}

            {(isLoadingMeals || isLoadingCategories || isPendingAddMeal) && <Preloader />}
            {isEmpty && !hasFilters && <p className={styles['meal__empty']}>{t('pages.admin.noAvailableMeal')}</p>}
            {isEmpty && hasFilters && <p className={styles['meal__empty']}>{t('pages.admin.noMealsInTheSelectedCategories')}</p>}

            {mealsList.length > 0 && restaurantId != null && (
                <ul className={styles['meal__list']}>
                    {mealsList.map((meal) => (
                        <li key={meal.id}>
                            <AdminMealCard meal={meal} restaurantId={restaurantId} onAdd={(id, features) => handleAddMeal(id, 1, features)} onAddCount={handleAddMeal} />
                        </li>
                    ))}
                </ul>
            )}

            <div className={styles['meal__category-filter']}>
                <CategoryFilter categories={categories} selectedIds={selectedIds} select={handleSelect} deselect={handleDeselect} customFilters={customFilters} />
            </div>
        </>
    );
}

export default MealStep;
