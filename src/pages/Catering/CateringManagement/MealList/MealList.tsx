import { useTranslation } from 'react-i18next';
import { useState, MouseEvent, useEffect } from 'react';
import styles from './MealList.module.scss';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';
import { useDeleteCateringMeal, useGetCateringMeals, useUpdateMeal } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import { CateringMeal } from '../../../../utils/api/cateringService/cateringService';
import MealItem from './MealItem/MealItem';
import ConfirmationPopup from '../../../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import CategoriesList from '../CategoriesList/CategoriesList';
import { useGetCateringById } from '../../../../utils/hooks/useCatering/useCatering';

const MealList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { data: meal, isSuccess, isPending } = useGetCateringMeals();
    const { data: сatering } = useGetCateringById(Number(cateringId));
    const { mutateAsync: deleteMeal, isPending: isDeleting } = useDeleteCateringMeal();
    const [showConfirmationPopup, setShowConfirmationPopup] = useState<number | null>(null);
    const { mutateAsync: updateMeal } = useUpdateMeal();
    const meals = isSuccess ? meal.data : [];
    const [isOpen, setIsOpen] = useState<number | null>(null);

    useEffect(() => {
        document.body.style.overflow = showConfirmationPopup ? 'hidden' : '';
    }, [showConfirmationPopup]);

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowConfirmationPopup(null);
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
        navigate(`/catering/${cateringId}/menu/add`);
    };

    const editMealClick = (mealId: number) => {
        navigate(`/catering/${cateringId}/menu/edit/${mealId}`);
    };

    const deleteMealClick = async (id: number) => {
        setShowConfirmationPopup(null);
        await deleteMeal(Number(id));
    };

    const toggleVisibleClick = async (mealId: number) => {
        const currentMeal = meals.find((m) => m.id === mealId);
        if (currentMeal) {
            await updateMeal({
                id: mealId,
                is_visible: !currentMeal.is_visible,
            });
        }
    };

    const deleteAdditiveClick = async (mealId: number, type: string) => {
        const currentMeal = meals.find((m) => m.id === mealId);
        if (!currentMeal) return;
        const updatedData: Partial<CateringMeal> & { id: number } = { ...currentMeal, id: mealId };

        switch (type) {
            case 'sizes':
                updatedData.mealSizes = [];
                break;
            case 'additives':
                updatedData.mealAdditives = [];
                break;
            case 'sauces':
                updatedData.mealSauces = [];
                break;
        }

        await updateMeal(updatedData);
    };

    return (
        <>
            <Popup title={t('pages.cateringManagement.titleMealMenu')} arrowBack={true} onClose={onCloseClick}>
                <div className={styles.buttons}>
                    <ButtonIconAdd onClick={addCategoryClick}>{t('pages.cateringManagement.addCategoriesMenu')}</ButtonIconAdd>
                    {сatering?.data.categories && <CategoriesList categories={сatering?.data.categories} onClick={categoryClick} />}
                    <ButtonIconAdd onClick={addMealClick}>{t('pages.cateringManagement.addMealToList')}</ButtonIconAdd>
                </div>

                {isPending && <Preloader />}
                {meals.length > 0 && (
                    <ul className={styles.list}>
                        {meals.map((meal) => (
                            <MealItem key={meal.id} onClickInfo={() => toggleClick(meal.id)} meal={meal} isOpen={isOpen === meal.id} onDelete={() => setShowConfirmationPopup(meal.id)} onEdit={() => editMealClick(meal.id)} isVisible={meal.is_visible} onVisible={() => toggleVisibleClick(meal.id)} onDeleteAdditive={(type) => deleteAdditiveClick(meal.id, type)} />
                        ))}
                    </ul>
                )}
            </Popup>
            {showConfirmationPopup && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToRemoveTheMeal')} confirmButtonText={t('components.confirmationPopup.delete')} onCancel={() => setShowConfirmationPopup(null)} onSubmit={() => deleteMealClick(showConfirmationPopup)} />
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

export default MealList;
