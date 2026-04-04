import { useTranslation } from 'react-i18next';
import { useState, MouseEvent, useEffect, useMemo } from 'react';
import styles from './Menu.module.scss';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';
import { useDeleteCateringMeal, useGetCateringMeals, useUpdateCateringMeal } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import MealItem from './MealItem/MealItem';
import ConfirmationPopup from '../../../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import { useGetCategories } from '../../../../utils/hooks/useCategory/useCategory';
import { Feature } from '../../../../utils/api/cateringMealService/cateringMealService';
import AddAdditivePopup from '../RegistrationStepsMeal/AdditivesStep/AddAdditivePopup/AddAdditivePopup';
import CategoriesList from '../../../../components/CategoriesList/CategoriesList';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';

const Menu = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { data: meal, isSuccess, isPending } = useGetCateringMeals(Number(cateringId));
    const { data: categories, isLoading } = useGetCategories(Number(cateringId));
    const { mutateAsync: deleteMeal, error: deleteMealError, isPending: isDeleting } = useDeleteCateringMeal();
    const { mutateAsync: updateMeal, error: updateMealError, isPending: isUpdating } = useUpdateCateringMeal();
    const [showConfirmationPopupDeleteMeal, setShowConfirmationPopupDeleteMeal] = useState(false);
    const [showConfirmationPopupDeleteFeature, setShowConfirmationPopupDeleteFeature] = useState(false);
    const [mealToDelete, setMealToDelete] = useState<number | null>(null);
    const [featureToDelete, setFeatureToDelete] = useState<{ cateringMealId: number; featureId: number } | null>(null);
    const [featureToEdit, setFeatureToEdit] = useState<{ cateringMealId: number; feature: Feature } | null>(null);
    const [isOpen, setIsOpen] = useState<number | null>(null);
    const error = deleteMealError || updateMealError;
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const meals = useMemo(() => {
        return isSuccess ? meal.data : [];
    }, [isSuccess, meal?.data]);

    const categoriesWithPhoto = useMemo(() => {
        if (!categories?.data || !meals.length) return [];
        return categories.data.map((category) => ({
            ...category,
            photo: category.photo || meals.find((meal) => meal.id === category.meal_ids?.[0])?.photo,
        }));
    }, [categories, meals]);

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowConfirmationPopupDeleteMeal(false);
        }
    };

    const onCloseClick = () => {
        navigate('/');
    };

    const categoryClick = (categoryId: number) => {
        navigate(`/catering/${cateringId}/menu/categories/${categoryId}`);
    };

    const addCategoryClick = () => {
        navigate(`/catering/${cateringId}/menu/add-category`);
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

    const handleDeleteFeature = (cateringMealId: number, featureId: number) => {
        setFeatureToDelete({ cateringMealId, featureId });
        setShowConfirmationPopupDeleteFeature(true);
        setShowConfirmationPopupDeleteMeal(false);
    };

    const handleConfirmDeleteFeature = async () => {
        if (!featureToDelete) return;
        const currentMeal = meals.find((m) => m.id === featureToDelete.cateringMealId);
        if (!currentMeal) return;
        const formData = new FormData();

        formData.append('name', currentMeal.name);
        formData.append('description', currentMeal.description || '');

        if (currentMeal.tags?.length) {
            currentMeal.tags.forEach((tag: { name: string }, index: number) => {
                formData.append(`tags[${index}]name`, tag.name);
            });
        }
        formData.append('base_price', String(currentMeal.base_price));
        formData.append('waiting_time', currentMeal.waiting_time);
        formData.append('is_visible', String(currentMeal.is_visible));

        const remainingFeatures = currentMeal.features?.filter((f) => f.id !== featureToDelete.featureId) ?? [];

        remainingFeatures.forEach((feature, fIndex) => {
            formData.append(`features[${fIndex}]id`, String(feature.id));
            formData.append(`features[${fIndex}]name`, feature.name);
            feature.choices.forEach((choice, cIndex) => {
                formData.append(`features[${fIndex}]choices[${cIndex}]id`, String(choice.id));
                formData.append(`features[${fIndex}]choices[${cIndex}]name`, choice.name);
                formData.append(`features[${fIndex}]choices[${cIndex}]price`, String(choice.price));
            });
        });

        await updateMeal({
            cateringId: Number(cateringId),
            cateringMealId: featureToDelete.cateringMealId,
            data: formData,
        });
        setShowConfirmationPopupDeleteFeature(false);
        setFeatureToDelete(null);
    };

    const handleEditFeature = (cateringMealId: number, feature: Feature) => {
        setFeatureToEdit({ cateringMealId, feature });
    };

    const handleSaveFeature = async (updatedFeature: Feature) => {
        if (!featureToEdit) return;
        const currentMeal = meals.find((m) => m.id === featureToEdit.cateringMealId);
        if (!currentMeal) return;
        const formData = new FormData();

        formData.append('name', currentMeal.name);
        formData.append('description', currentMeal.description || '');

        if (currentMeal.tags?.length) {
            currentMeal.tags.forEach((tag: { name: string }, index: number) => {
                formData.append(`tags[${index}]name`, tag.name);
            });
        }
        formData.append('base_price', String(currentMeal.base_price));
        formData.append('waiting_time', currentMeal.waiting_time);
        formData.append('is_visible', String(currentMeal.is_visible));

        const updatedFeatures = currentMeal.features?.map((f) => (f.id === updatedFeature.id ? updatedFeature : f)) ?? [];

        updatedFeatures.forEach((feature, fIndex) => {
            formData.append(`features[${fIndex}]id`, String(feature.id));
            formData.append(`features[${fIndex}]name`, feature.name);
            feature.choices.forEach((choice, cIndex) => {
                formData.append(`features[${fIndex}]choices[${cIndex}]id`, String(choice.id));
                formData.append(`features[${fIndex}]choices[${cIndex}]name`, choice.name);
                formData.append(`features[${fIndex}]choices[${cIndex}]price`, String(choice.price));
            });
        });

        await updateMeal({
            cateringId: Number(cateringId),
            cateringMealId: featureToEdit.cateringMealId,
            data: formData,
        });
        setFeatureToEdit(null);
    };

    const handleDeleteMeal = (cateringMealId: number) => {
        setMealToDelete(cateringMealId);
        setShowConfirmationPopupDeleteMeal(true);
        setShowConfirmationPopupDeleteFeature(false);
    };

    const handleConfirmDeleteMeal = async () => {
        if (!mealToDelete) return;
        await deleteMeal({ cateringId: Number(cateringId), cateringMealId: mealToDelete });
        setShowConfirmationPopupDeleteMeal(false);
        setMealToDelete(null);
    };

    const toggleVisibleClick = async (cateringMealId: number) => {
        const currentMeal = meals.find((m) => m.id === cateringMealId);
        if (!currentMeal) return;
        const formData = new FormData();

        formData.append('name', currentMeal.name);
        formData.append('description', currentMeal.description || '');

        if (currentMeal.tags?.length) {
            currentMeal.tags.forEach((tag: { name: string }, index: number) => {
                formData.append(`tags[${index}]name`, tag.name);
            });
        }
        formData.append('base_price', String(currentMeal.base_price));
        formData.append('waiting_time', currentMeal.waiting_time);
        formData.append('is_visible', String(!currentMeal.is_visible));

        if (currentMeal.features && currentMeal.features.length > 0) {
            currentMeal.features.forEach((feature, fIndex) => {
                formData.append(`features[${fIndex}]id`, String(feature.id));
                formData.append(`features[${fIndex}]name`, feature.name);

                feature.choices.forEach((choice, cIndex) => {
                    formData.append(`features[${fIndex}]choices[${cIndex}]id`, String(choice.id));
                    formData.append(`features[${fIndex}]choices[${cIndex}]name`, choice.name);
                    formData.append(`features[${fIndex}]choices[${cIndex}]price`, String(choice.price));
                });
            });
        }

        await updateMeal({
            cateringId: Number(cateringId),
            cateringMealId: Number(cateringMealId),
            data: formData,
        });
    };

    useEffect(() => {
        document.body.style.overflow = showConfirmationPopupDeleteMeal || showConfirmationPopupDeleteFeature || featureToEdit ? 'hidden' : '';
    }, [showConfirmationPopupDeleteMeal, showConfirmationPopupDeleteFeature, featureToEdit]);

    return (
        <>
            <Popup title={t('pages.cateringManagement.menu')} arrowBack={true} onClose={onCloseClick}>
                {(isPending || isDeleting || isLoading || isUpdating) && <Preloader />}
                {error && (
                    <div style={{ padding: '0 20px' }}>
                        <ErrorMessage message={errorMessage} />
                    </div>
                )}
                <div className={styles.buttons}>
                    <ButtonIconAdd onClick={addCategoryClick}>{t('pages.cateringManagement.addCategoriesMenu')}</ButtonIconAdd>
                    {categories && categories.data.length > 0 && <CategoriesList onClick={categoryClick} categories={categoriesWithPhoto} />}
                    <ButtonIconAdd onClick={addMealClick}>{t('pages.cateringManagement.addMeal')}</ButtonIconAdd>
                </div>

                {meals.length > 0 && (
                    <ul className={styles.list}>
                        {meals.map((meal) => (
                            <MealItem key={meal.id} onClickInfo={() => toggleClick(meal.id)} meal={meal} isOpen={isOpen === meal.id} onDelete={() => handleDeleteMeal(meal.id)} onEdit={() => editMealClick(meal.id)} isVisible={meal.is_visible} onVisible={() => toggleVisibleClick(meal.id)} onDeleteFeature={(featureId) => handleDeleteFeature(meal.id, featureId)} onEditFeature={(feature) => handleEditFeature(meal.id, feature)} />
                        ))}
                    </ul>
                )}
            </Popup>
            {showConfirmationPopupDeleteMeal && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToRemoveTheMeal')} confirmButtonText={t('components.confirmationPopup.delete')} onCancel={() => setShowConfirmationPopupDeleteMeal(false)} onSubmit={handleConfirmDeleteMeal} />
                    {isDeleting && (
                        <div className={styles['preloader-wrapper']}>
                            <Preloader />
                        </div>
                    )}
                </div>
            )}
            {showConfirmationPopupDeleteFeature && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToRemoveTheMealFeature')} confirmButtonText={t('components.confirmationPopup.delete')} onCancel={() => setShowConfirmationPopupDeleteFeature(false)} onSubmit={handleConfirmDeleteFeature} />
                    {isUpdating && (
                        <div className={styles['preloader-wrapper']}>
                            <Preloader />
                        </div>
                    )}
                </div>
            )}
            {featureToEdit && <AddAdditivePopup data={featureToEdit.feature} onClose={() => setFeatureToEdit(null)} onSave={handleSaveFeature} />}
        </>
    );
};

export default Menu;
