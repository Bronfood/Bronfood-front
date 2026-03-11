import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import InfoImage from '../../../../components/InfoImage/InfoImage';
import styles from './CollectWeeklyMenu.module.scss';
import WeeklyButtons from './WeeklyButtons/WeeklyButtons';
import Button from '../../../../components/Button/Button';
import { useDeleteCategoryToWeeklyMenu, useGetWeeklyMenu, useGetWeeklyMenuByWeekday } from '../../../../utils/hooks/useWeeklyMenu/useWeeklyMenu';
import Preloader from '../../../../components/Preloader/Preloader';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, MouseEvent } from 'react';
import { Weekday } from '../../../../utils/api/cateringService/cateringService';
import ConfirmationPopup from '../../../../components/Popups/ConfirmationPopup/ConfirmationPopup';

const CollectWeeklyMenu = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { cateringId, day: selectedDay } = useParams<{ cateringId: string; day?: string }>();
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const { data: menuWeekday, isLoading } = useGetWeeklyMenuByWeekday(selectedDay || '');
    const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);
    const { data: allMenuWeekday, isLoading: isLoadingAll } = useGetWeeklyMenu();
    const { mutateAsync: deleteCategoryToWeeklyMenu, isPending: isDeleting } = useDeleteCategoryToWeeklyMenu();

    const handleDeleteClick = (dailyCategoryId: number) => {
        setCategoryIdToDelete(dailyCategoryId);
        setShowConfirmationPopup(true);
    };

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowConfirmationPopup(false);
            setCategoryIdToDelete(null);
        }
    };

    const onClose = () => {
        navigate(`/catering/${cateringId}`);
    };

    const handleDayClick = (day: string) => {
        navigate(`/catering/${cateringId}/collect-weekly-menu/${day}`);
    };

    const onCollectWeeklyMenu = () => {
        navigate(`/catering/${cateringId}/collect-weekly-menu/${selectedDay}/add-category-weekly-menu`, {
            state: { weekday: selectedDay },
        });
    };

    const hasDailyCategories = useMemo(() => {
        if (!allMenuWeekday?.data) return [];

        return allMenuWeekday.data.filter((menu) => menu.daily_categories && menu.daily_categories.length > 0).map((menu) => menu.weekday);
    }, [allMenuWeekday]);

    const handleDeleteCategory = async () => {
        if (!selectedDay || !categoryIdToDelete) return;
        setShowConfirmationPopup(false);
        await deleteCategoryToWeeklyMenu({ weekday: selectedDay as Weekday, dailyCategoryId: categoryIdToDelete });
    };

    const handleEditCategory = (dailyCategoryId: number) => {
        navigate(`/catering/${cateringId}/collect-weekly-menu/${selectedDay}/edit-category-weekly-menu/${dailyCategoryId}`, {
            state: { weekday: selectedDay },
        });
    };

    return (
        <>
            {isLoading || (isLoadingAll && <Preloader />)}
            <Popup arrowBack onClose={onClose} title={t('pages.cateringManagement.titleWeeklyMenu')}>
                <WeeklyButtons selectedDay={selectedDay || null} onDayClick={handleDayClick} hasDailyCategories={hasDailyCategories} />
                {selectedDay && menuWeekday?.data?.daily_categories && menuWeekday?.data.daily_categories.length > 0 ? (
                    <>
                        <ul className={styles.list}>
                            {menuWeekday.data.daily_categories.map((category) => (
                                <li key={category.id} className={styles.list__item}>
                                    <div className={styles.list__header}>
                                        <p className={styles.list__name}>{category.name}</p>
                                        <div className={styles.list__buttons}>
                                            <button className={`${styles.list__button} ${styles.list__edit}`} onClick={() => handleEditCategory(category.id)}></button>
                                            <button className={`${styles.list__button} ${styles.list__delete}`} onClick={() => handleDeleteClick(category.id)}></button>
                                        </div>
                                    </div>
                                    {category.meals && category.meals.length > 0 && (
                                        <ul className={styles.list__meal}>
                                            {category.meals.map((meal) => (
                                                <li key={meal.id} className={styles.list__meal_item}>
                                                    <p className={styles.list__meal_name}>{meal.name}</p>
                                                    <p className={styles.list__meal_price}>{`${meal.base_price} ₸`}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <ButtonIconAdd onClick={onCollectWeeklyMenu}>{t('pages.cateringManagement.buttonAddCategory')}</ButtonIconAdd>
                    </>
                ) : selectedDay ? (
                    <>
                        <div className={styles.content}>
                            <h2 className={styles.content__title}>{t('pages.cateringManagement.youDonHaveCollectMenu')}</h2>
                            <p className={styles.content__description}>{t('pages.cateringManagement.collectADailyMenuOfYourMeal')}</p>
                            <InfoImage mode="question_tube" />
                        </div>
                        <div className={styles.submit}>
                            <Button type="button" onClick={onCollectWeeklyMenu}>
                                Собрать меню
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className={styles.content}>
                        <h2 className={styles.content__title}>{t('pages.cateringManagement.choosingDay')}</h2>
                        <p className={styles.content__description}>{t('pages.cateringManagement.chooseDayToCollectMenuForTheDesiredDayAndPlanTheCategoriesInAdvance')}</p>
                        <InfoImage mode="without_tube" />
                    </div>
                )}
            </Popup>
            {showConfirmationPopup && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToRemoveCategoryToWeeklyMenu')} confirmButtonText={t('components.confirmationPopup.delete')} onCancel={() => setShowConfirmationPopup(false)} onSubmit={handleDeleteCategory} />
                    {isDeleting && (
                        <div className={styles['preloader-wrapper']}>
                            <Preloader />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default CollectWeeklyMenu;
