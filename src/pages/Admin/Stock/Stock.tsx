import Preloader from '../../../components/Preloader/Preloader';
import { useTranslation } from 'react-i18next';
import styles from './Stock.module.scss';
import { useState } from 'react';
import Button from '../../../components/ButtonIconSquare/ButtonIconSquare';
import { useNavigate } from 'react-router-dom';
import CategoryFilter from '../../../components/CategoryFilter/CategoryFilter';
import { useGetAdminCategory } from '../../../utils/hooks/useAdminNewOrder/useAdminNewOrder';
import { useGetAdminStockMeals } from '../../../utils/hooks/useAdminStock/useAdminStock';
import { useCurrentUser } from '../../../utils/hooks/useCurrentUser/useCurretUser';

function Stock() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { restaurantId } = useCurrentUser();
    const { data: meals, isLoading: isLoadingMeals } = useGetAdminStockMeals(Number(restaurantId));
    const { data: categories, isLoading: isLoadingCategories } = useGetAdminCategory();

    const [overrides, setOverrides] = useState<Record<number, boolean>>({});
    const [isOpen, setIsOpen] = useState<number | null>(null);
    const [selected, setSelected] = useState<Record<number, boolean>>({});
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showUncategorized, setShowUncategorized] = useState(false);
    const [showHidden, setShowHidden] = useState(false);

    const handleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const handleDeselect = (id: number) => {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const handleSelectChoice = (choiceId: number, current: boolean) => {
        setSelected((prev) => ({ ...prev, [choiceId]: !current }));
    };

    const handleVisibleToggle = (mealId: number, current: boolean) => {
        setOverrides((prev) => ({ ...prev, [mealId]: !current }));
    };

    const handleInfoToggle = (mealId: number) => {
        setIsOpen((prev) => (prev === mealId ? null : mealId));
    };

    const close = () => {
        navigate('/manager');
    };

    const filteredMeals = !meals?.data
        ? []
        : (() => {
              const hasFilters = selectedIds.length > 0 || showHidden || showUncategorized;
              if (!hasFilters) return meals.data;

              return meals.data.filter((meal) => {
                  const isVisible = overrides[meal.id] ?? !!meal.is_visible;
                  if (showHidden && !isVisible) return true;
                  if (meal.category && selectedIds.includes(meal.category.id)) return true;
                  if (!meal.category && showUncategorized) return true;

                  return false;
              });
          })();

    return (
        <div className={styles['stock']}>
            <div className={`${styles['stock__close']} ${styles['stock__close_button']}`}>
                <Button type="button" onClick={close} icon="close" />
            </div>
            {(isLoadingMeals || isLoadingCategories) && <Preloader />}
            <h2 className={styles['stock__title']}>{t(`pages.admin.stock`)}</h2>
            {!meals?.data?.length && <p className={styles['stock__empty']}>{t('pages.admin.noAvailableMeal')}</p>}
            {!!meals?.data?.length && filteredMeals.length === 0 && <p className={styles['stock__empty']}>{t('pages.admin.noMealsInTheSelectedCategories')}</p>}
            {filteredMeals.length > 0 && (
                <ul className={styles['stock__meals']}>
                    {filteredMeals.map((meal) => {
                        const isMealVisible = overrides[meal.id] ?? !!meal.is_visible;
                        return (
                            <li key={meal.id} className={styles['stock__item']}>
                                {!isMealVisible && <div className={styles['stock__item_overlay']}></div>}
                                <div className={`${styles['stock__item_visible']} ${isMealVisible ? styles['stock__item_visible_active'] : ''}`}>
                                    <button className={`${styles['stock__item_visible_slider']} ${styles['stock__slider']} ${isMealVisible ? styles.active : ''}`} onClick={() => handleVisibleToggle(meal.id, isMealVisible)}>
                                        <span className={`${styles['stock__handle']} ${isMealVisible ? styles.active : ''}`} />
                                    </button>
                                </div>
                                <div className={styles['stock__short-info']}>
                                    <div className={styles['stock__item_photo']} style={{ backgroundImage: `url(${meal.photo})` }}></div>
                                    <div className={styles['stock__item_info']}>
                                        <p className={`${styles['stock__item_name']} ${styles['stock__item_text']}`}>{meal.name}</p>
                                        <p className={`${styles['stock__item_description']} ${styles['stock__item_text']} ${isOpen === meal.id ? styles.hide : ''}`}>{meal.description}</p>
                                    </div>
                                    <button className={styles['stock__button']} onClick={() => handleInfoToggle(meal.id)}>
                                        {isOpen === meal.id ? <div className={`${styles['stock__details']} ${styles['stock__details_hide']}`}></div> : <div className={`${styles['stock__details']} ${styles['stock__details_show']}`}></div>}
                                    </button>
                                </div>
                                {isOpen === meal.id && (
                                    <div className={styles['stock__detail-info']}>
                                        <p className={styles['stock__item_description']}>{meal.description}</p>
                                        {meal.features && meal.features.length > 0 && (
                                            <ul className={styles['stock__item_features']}>
                                                {meal.features.map((feature) => (
                                                    <li key={feature.id} className={styles['stock__item_feature']}>
                                                        <p className={styles['stock__item_feature_name']}>{feature.name}</p>
                                                        {feature.choices.length > 0 && (
                                                            <ul className={styles['stock__item_feature_choices']}>
                                                                {feature.choices.map((choice) => {
                                                                    const checked = selected[choice.id] ?? choice.is_visible ?? false;
                                                                    return (
                                                                        <li key={choice.id} className={styles['stock__item_feature_item']}>
                                                                            <label>
                                                                                <p className={styles['stock__item_feature_item_name']}>{choice.name}</p>
                                                                                <input type="checkbox" name={`choice-${meal.id}-${feature.id}-${choice.id}`} checked={checked} onChange={() => handleSelectChoice(choice.id, checked)}></input>
                                                                            </label>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {categories && categories.data.length > 0 && (
                <div className={styles['stock__category-filter']}>
                    <CategoryFilter categories={categories.data} selectedIds={selectedIds} select={handleSelect} deselect={handleDeselect} hidden={{ selected: showHidden, onSelect: () => setShowHidden(true), onDeselect: () => setShowHidden(false) }} uncategorized={{ selected: showUncategorized, onSelect: () => setShowUncategorized(true), onDeselect: () => setShowUncategorized(false) }} />{' '}
                </div>
            )}
        </div>
    );
}

export default Stock;
