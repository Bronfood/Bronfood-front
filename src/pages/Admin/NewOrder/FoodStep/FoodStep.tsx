import Preloader from '../../../../components/Preloader/Preloader';
import { useGetFoodForOrder } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrder';
import styles from './FoodStep.module.scss';
import FoodCardItem from './FoodCardItem/FoodCardItem';
import { useGetAdminCategory } from '../../../../utils/hooks/useAdminCategory/useAdminCategory';
import CategoryFilter from '../../../../components/CategoryFilter/CategoryFilter';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function FoodStep() {
    const { t } = useTranslation();
    const { data: foods, isLoading: isLoadingFoods } = useGetFoodForOrder();
    const { data: categories, isLoading: isLoadingCategories } = useGetAdminCategory();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showUncategorized, setShowUncategorized] = useState(false);

    const handleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const handleDeselect = (id: number) => {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const filteredFoods = !foods?.data
        ? []
        : selectedIds.length === 0 && !showUncategorized
          ? foods.data
          : foods.data.filter((food) => {
                const hasCategory = !!food.category;
                const matchesCategory = hasCategory && selectedIds.includes(food.category!.id);
                const matchesUncategorized = !hasCategory && showUncategorized;
                return matchesCategory || matchesUncategorized;
            });

    return (
        <>
            {(isLoadingFoods || isLoadingCategories) && <Preloader />}
            <>
                {filteredFoods.length > 0 ? (
                    <ul className={styles['food__list']}>
                        {filteredFoods.map((food) => (
                            <li key={food.id}>
                                <FoodCardItem food={food} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles['food__empty']}>{t('pages.admin.noMealsInTheSelectedCategories')}</p>
                )}
            </>
            {categories && categories.data.length > 0 && <CategoryFilter categories={categories.data} selectedIds={selectedIds} select={handleSelect} deselect={handleDeselect} uncategorized={{ selected: showUncategorized, onSelect: () => setShowUncategorized(true), onDeselect: () => setShowUncategorized(false) }} />}
        </>
    );
}

export default FoodStep;
