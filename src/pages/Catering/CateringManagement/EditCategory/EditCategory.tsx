import { FieldValues, SubmitHandler } from 'react-hook-form';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import RegistrationCategory from '../RegistrationCategory/RegistrationCategory';
import Preloader from '../../../../components/Preloader/Preloader';
import { useDeleteCategory, useGetCategoryById, useUpdateCategory } from '../../../../utils/hooks/useCategory/useCategory';
import { useState, MouseEvent } from 'react';
import ConfirmationPopup from '../../../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import styles from './EditCategory.module.scss';
import ButtonGrey from '../../../../components/ButtonGrey/ButtonGrey';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';

const EditCategory = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId, categoryId } = useParams();
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const { data: category, isLoading } = useGetCategoryById(Number(cateringId), Number(categoryId));
    const { mutateAsync: deleteCategory, error: deleteCategoryError, isPending: isDeleting } = useDeleteCategory();
    const { mutateAsync: updateCategory, error: updateCategoryError, isPending: isUpdating } = useUpdateCategory();
    const error = deleteCategoryError || updateCategoryError;
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const onClose = () => {
        navigate(-1);
    };

    const handleDelete = () => {
        setShowConfirmationPopup(true);
    };

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowConfirmationPopup(false);
        }
    };

    const handleConfirmDelete = async () => {
        setShowConfirmationPopup(false);
        await deleteCategory({ cateringId: Number(cateringId), categoryId: Number(categoryId) });
        navigate(`/catering/${cateringId}/menu`);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        await updateCategory({
            cateringId: Number(cateringId),
            data: {
                categoryId: Number(categoryId),
                name: data.name,
                meal_ids: data.meal_ids || [],
            },
        });
        navigate(`/catering/${cateringId}/menu`, {
            state: {
                fromSubmit: true,
            },
        });
    };

    return (
        <>
            <Popup title={t('pages.cateringManagement.editingCategory')} onClose={onClose}>
                {(isLoading || isUpdating) && <Preloader />}
                {error && (
                    <div style={{ padding: '0 20px' }}>
                        <ErrorMessage message={errorMessage} />
                    </div>
                )}
                {category && (
                    <RegistrationCategory
                        onSubmit={onSubmit}
                        defaultValues={{
                            name: category.data.name || '',
                            meal_ids: category.data.meal_ids || [],
                        }}
                        renderDeleteButton={
                            <ButtonGrey type="button" onClick={handleDelete}>
                                {t('pages.cateringManagement.deleteCategory')}
                            </ButtonGrey>
                        }
                    />
                )}
            </Popup>
            {showConfirmationPopup && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToRemoveTheCategory')} confirmButtonText={t('components.confirmationPopup.delete')} onCancel={() => setShowConfirmationPopup(false)} onSubmit={handleConfirmDelete} />
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

export default EditCategory;
