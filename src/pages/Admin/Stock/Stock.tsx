import Preloader from '../../../components/Preloader/Preloader';
import { useTranslation } from 'react-i18next';
import styles from './Stock.module.scss';
import { useState } from 'react';
import Button from '../../../components/ButtonIconSquare/ButtonIconSquare';
import { useNavigate } from 'react-router-dom';
import CategoryFilter from '../../../components/CategoryFilter/CategoryFilter';
import { useGetAdminStockMeals, useSetAdminStockMealChoiceVisibility, useSetAdminStockMealVisibility } from '../../../utils/hooks/useAdminStock/useAdminStock';
import { useCurrentUser } from '../../../utils/hooks/useCurrentUser/useCurretUser';
import { useGetAdminCategories } from '../../../utils/hooks/useAdminCategory/useAdminCategory';
import { Category } from '../../../utils/api/categoryService/categoryService';
import StockAdminMealCard from '../../../components/Cards/StockAdminMealCard/StockAdminMealCard';
import { AdminStockFilters } from '../../../utils/api/adminStockService/adminStockService';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '../../../utils/serviceFuncs/getErrorMessage';

function Stock() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showUncategorized, setShowUncategorized] = useState(false);
    const [showHidden, setShowHidden] = useState(false);

    const { restaurantId } = useCurrentUser();
    const numericRestaurantId = Number(restaurantId);
    const filters: AdminStockFilters = {
        isVisible: showHidden ? false : undefined,
        uncategorized: showUncategorized || undefined,
        categoryIds: selectedIds.length > 0 ? selectedIds : undefined,
    };

    const { data: meals, isLoading: isLoadingMeals, error: mealsError } = useGetAdminStockMeals(numericRestaurantId, filters);
    const { data: categoriesData, isLoading: isLoadingCategories, error: categoriesError } = useGetAdminCategories(numericRestaurantId);
    const { mutate: setMealVisibility, isPending: isPendingMealVisibility, error: mealVisibilityError } = useSetAdminStockMealVisibility();
    const { mutate: setMealChoiceVisibility, isPending: isPendingMealChoiceVisibility, error: mealChoiceVisibilityError } = useSetAdminStockMealChoiceVisibility();

    const categories: Category[] = categoriesData?.data ?? [];
    const error = mealVisibilityError || mealChoiceVisibilityError || mealsError || categoriesError;
    const errorMessage = error ? getErrorMessage(error, 'pages.admin.') : '';

    const customFilters = [
        { name: 'hidden', text: t('pages.admin.hidden'), selected: showHidden, onSelect: () => setShowHidden(true), onDeselect: () => setShowHidden(false) },
        { name: 'uncategorized', text: t('pages.admin.uncategorized'), selected: showUncategorized, onSelect: () => setShowUncategorized(true), onDeselect: () => setShowUncategorized(false) },
    ];

    const handleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const handleDeselect = (id: number) => {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const handleVisibleToggleMeal = (mealId: number, current: boolean) => {
        setMealVisibility({
            restaurantId: numericRestaurantId,
            mealId,
            payload: { is_visible: !current },
        });
    };

    const handleVisibleToggleMealChoice = (mealId: number, choiceId: number, current: boolean) => {
        setMealChoiceVisibility({
            restaurantId: numericRestaurantId,
            mealId,
            choiceId,
            payload: { is_visible: !current },
        });
    };

    const close = () => {
        navigate('/manager');
    };

    const hasFilters = selectedIds.length > 0 || showHidden || showUncategorized;
    const mealsList = meals?.data ?? [];
    const isEmpty = !isLoadingMeals && !mealsError && mealsList.length === 0;

    return (
        <div className={styles['stock']}>
            {(isLoadingMeals || isLoadingCategories || isPendingMealVisibility || isPendingMealChoiceVisibility) && (
                <div className={styles['stock__preloader']}>
                    <Preloader />
                </div>
            )}

            <div className={`${styles['stock__close']} ${styles['stock__close_button']}`}>
                <Button type="button" onClick={close} icon="close" />
            </div>

            <h2 className={styles['stock__title']}>{t(`pages.admin.stock`)}</h2>

            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}

            {isEmpty && !hasFilters && <p className={styles['stock__empty']}>{t('pages.admin.noAvailableMeal')}</p>}
            {isEmpty && hasFilters && <p className={styles['stock__empty']}>{t('pages.admin.noMealsInTheSelectedCategories')}</p>}

            {mealsList.length > 0 && (
                <ul className={styles['stock__meals']}>
                    {mealsList.map((meal) => (
                        <StockAdminMealCard key={meal.id} meal={meal} isMealVisible={meal.is_visible} onVisibleToggle={() => handleVisibleToggleMeal(meal.id, meal.is_visible)} onChoiceToggle={(choiceId, current) => handleVisibleToggleMealChoice(meal.id, choiceId, current)} />
                    ))}
                </ul>
            )}

            <div className={styles['stock__category-filter']}>
                <CategoryFilter categories={categories} selectedIds={selectedIds} select={handleSelect} deselect={handleDeselect} customFilters={customFilters} />
            </div>
        </div>
    );
}

export default Stock;
