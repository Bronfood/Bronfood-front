import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAdminStockMeals, useSetAdminStockMealChoiceVisibility, useSetAdminStockMealVisibility } from '../../../utils/hooks/useAdminStock/useAdminStock';
import { useCurrentUser } from '../../../utils/hooks/useCurrentUser/useCurretUser';
import { useGetAdminCategories } from '../../../utils/hooks/useAdminCategory/useAdminCategory';
import { Category } from '../../../utils/api/categoryService/categoryService';
import { AdminStockFilters, MealChoice } from '../../../utils/api/adminStockService/adminStockService';
import { getErrorMessage } from '../../../utils/serviceFuncs/getErrorMessage';
import Button from '../../../components/ButtonIconSquare/ButtonIconSquare';
import Preloader from '../../../components/Preloader/Preloader';
import CategoryFilter from '../../../components/CategoryFilter/CategoryFilter';
import StockAdminMealCard from '../../../components/Cards/StockAdminMealCard/StockAdminMealCard';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import NewDefaultChoicePopup from './NewDefaultChoicePopup/NewDefaultChoicePopup';
import styles from './Stock.module.scss';

function Stock() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showUncategorized, setShowUncategorized] = useState(false);
    const [showHidden, setShowHidden] = useState(false);
    const [popupData, setPopupData] = useState<{
        mealId: number;
        choiceIdToHide: number;
        availableChoices: MealChoice[];
    } | null>(null);

    const filters: AdminStockFilters = {
        isVisible: showHidden ? false : undefined,
        uncategorized: showUncategorized || undefined,
        categoryIds: selectedIds.length > 0 ? selectedIds : undefined,
    };

    const { restaurantId } = useCurrentUser();
    const { data: meals, isLoading: isLoadingMeals, error: mealsError } = useGetAdminStockMeals(restaurantId, filters);
    const { data: categoriesData, isLoading: isLoadingCategories, error: categoriesError } = useGetAdminCategories(restaurantId);
    const { mutate: setMealVisibility, isPending: isPendingMealVisibility, error: mealVisibilityError } = useSetAdminStockMealVisibility();
    const { mutate: setMealChoiceVisibility, isPending: isPendingMealChoiceVisibility, error: mealChoiceVisibilityError } = useSetAdminStockMealChoiceVisibility();

    const categories: Category[] = categoriesData?.data ?? [];
    const error = mealVisibilityError || (!popupData && mealChoiceVisibilityError) || mealsError || categoriesError;
    const errorMessage = error ? getErrorMessage(error, 'pages.admin.') : '';
    const loading = isLoadingMeals || isLoadingCategories || isPendingMealVisibility || isPendingMealChoiceVisibility;
    const hasFilters = selectedIds.length > 0 || showHidden || showUncategorized;
    const mealsList = meals?.data ?? [];
    const isEmpty = !isLoadingMeals && !mealsError && mealsList.length === 0;

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
        if (!restaurantId) return;
        setMealVisibility({
            restaurantId: restaurantId,
            mealId,
            payload: { is_visible: !current },
        });
    };

    const handleVisibleToggleMealChoice = (mealId: number, choiceId: number, current: boolean, featureChoices?: MealChoice[]) => {
        if (!restaurantId) return;
        if (featureChoices) {
            const available = featureChoices.filter((c) => c.is_visible && c.id !== choiceId);

            setPopupData({
                mealId,
                choiceIdToHide: choiceId,
                availableChoices: available,
            });
            return;
        }

        setMealChoiceVisibility({
            restaurantId: restaurantId,
            mealId,
            choiceId,
            payload: {
                is_visible: !current,
            },
        });
    };

    const handleConfirmNewDefault = (newDefaultId: number) => {
        if (!popupData) return;
        if (!restaurantId) return;

        setMealChoiceVisibility(
            {
                restaurantId: restaurantId,
                mealId: popupData.mealId,
                choiceId: popupData.choiceIdToHide,
                payload: {
                    is_visible: false,
                    new_default_choice_id: newDefaultId,
                },
            },
            {
                onSuccess: () => setPopupData(null),
            }
        );
    };

    useEffect(() => {
        if (popupData || loading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [popupData, loading]);

    return (
        <>
            {loading && (
                <div className={styles['stock__preloader']}>
                    <Preloader />
                </div>
            )}
            <div className={`${styles['stock']} ${popupData ? styles['stock_overlay'] : ''}`}>
                <div className={`${styles['stock__close']} ${styles['stock__close_button']}`}>
                    <Button type="button" onClick={() => navigate('/manager')} icon="close" />
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
                            <StockAdminMealCard key={meal.id} meal={meal} isMealVisible={meal.is_visible} onVisibleToggle={() => handleVisibleToggleMeal(meal.id, meal.is_visible)} onChoiceToggle={(choiceId, current, featureChoices) => handleVisibleToggleMealChoice(meal.id, choiceId, current, featureChoices)} />
                        ))}
                    </ul>
                )}

                <div className={styles['stock__category-filter']}>
                    <CategoryFilter categories={categories} selectedIds={selectedIds} select={handleSelect} deselect={handleDeselect} customFilters={customFilters} />
                </div>
            </div>

            {popupData && <NewDefaultChoicePopup availableChoices={popupData.availableChoices} onClose={() => setPopupData(null)} onConfirm={handleConfirmNewDefault} isLoading={isPendingMealChoiceVisibility} errorMessage={mealChoiceVisibilityError ? getErrorMessage(mealChoiceVisibilityError, 'pages.admin.') : ''} />}
        </>
    );
}

export default Stock;
