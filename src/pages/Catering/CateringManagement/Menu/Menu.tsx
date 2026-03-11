import { useTranslation } from 'react-i18next';
import { useState, MouseEvent, useEffect } from 'react';
import styles from './Menu.module.scss';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';
import { useDeleteCateringMeal, useGetCateringMeals, useUpdateCateringMeal } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import MealItem from './MealItem/MealItem';
import ConfirmationPopup from '../../../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import CategoriesList from '../CategoriesList/CategoriesList';

const Menu = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { data: meal, isSuccess, isPending } = useGetCateringMeals(Number(cateringId));
    const { mutateAsync: deleteMeal, isPending: isDeleting } = useDeleteCateringMeal();
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [mealToDelete, setMealToDelete] = useState<number | null>(null);
    const { mutateAsync: updateMeal } = useUpdateCateringMeal();
    const meals = isSuccess ? meal.data : [];
    const [isOpen, setIsOpen] = useState<number | null>(null);

    useEffect(() => {
        document.body.style.overflow = showConfirmationPopup ? 'hidden' : '';
    }, [showConfirmationPopup]);

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowConfirmationPopup(false);
        }
    };

    const onCloseClick = () => {
        navigate('/catering');
    };

    const categoryClick = (categoryId: number) => {
        navigate(`/catering/${cateringId}/menu/category/${categoryId}`);
    };

    const addCategoryClick = () => {
        navigate(`/catering/${cateringId}/menu/category`);
    };

    const toggleClick = (id: number) => {
        setIsOpen((prev) => (prev === id ? null : id));
    };

    const addMealClick = () => {
        navigate(`/catering/${cateringId}/menu/add-meal`);
    };

    const editMealClick = (cateringMealId: number) => {
        navigate(`/catering/${cateringId}/menu/${cateringMealId}`);
    };

    const handleDelete = (cateringMealId: number) => {
        setMealToDelete(cateringMealId);
        setShowConfirmationPopup(true);
    };

    const handleConfirmDelete = async () => {
        if (!mealToDelete) return;
        setShowConfirmationPopup(false);
        await deleteMeal({ cateringId: Number(cateringId), cateringMealId: mealToDelete });
        setMealToDelete(null);
    };

    const toggleVisibleClick = async (cateringMealId: number) => {
        const currentMeal = meals.find((m) => m.id === cateringMealId);
        if (!currentMeal) return;
        const formData = new FormData();

        formData.append('name', currentMeal.name);
        formData.append('description', currentMeal.description || '');
        formData.append('type', currentMeal.type);

        if (currentMeal.tags?.length) {
            currentMeal.tags.forEach((tag: { name: string }, index: number) => {
                formData.append(`tags[${index}]name`, tag.name);
            });
        }
        formData.append('base_price', String(currentMeal.base_price));
        formData.append('waiting_time', currentMeal.waiting_time);
        formData.append('is_visible', String(!currentMeal.is_visible));

        if (currentMeal) {
            await updateMeal({
                cateringId: Number(cateringId),
                cateringMealId: Number(cateringMealId),
                data: formData,
            });
        }
    };

    return (
        <>
            <Popup title={t('pages.cateringManagement.titleMealMenu')} arrowBack={true} onClose={onCloseClick}>
                <div className={styles.buttons}>
                    <ButtonIconAdd onClick={addCategoryClick}>{t('pages.cateringManagement.addCategoriesMenu')}</ButtonIconAdd>
                    <CategoriesList onClick={categoryClick} />
                    <ButtonIconAdd onClick={addMealClick}>{t('pages.cateringManagement.addMealToList')}</ButtonIconAdd>
                </div>

                {(isPending || isDeleting) && <Preloader />}
                {meals.length > 0 && (
                    <ul className={styles.list}>
                        {meals.map((meal) => (
                            <MealItem key={meal.id} onClickInfo={() => toggleClick(meal.id)} meal={meal} isOpen={isOpen === meal.id} onDelete={() => handleDelete(meal.id)} onEdit={() => editMealClick(meal.id)} isVisible={meal.is_visible} onVisible={() => toggleVisibleClick(meal.id)} />
                        ))}
                    </ul>
                )}
            </Popup>
            {showConfirmationPopup && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToRemoveTheMeal')} confirmButtonText={t('components.confirmationPopup.delete')} onCancel={() => setShowConfirmationPopup(false)} onSubmit={handleConfirmDelete} />
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

export default Menu;
