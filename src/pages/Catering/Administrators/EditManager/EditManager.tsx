import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import Preloader from '../../../../components/Preloader/Preloader';
import ButtonGrey from '../../../../components/ButtonGrey/ButtonGrey';
import { useState, MouseEvent } from 'react';
import ConfirmationPopup from '../../../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import styles from './EditManager.module.scss';
import { useDeleteManager, useGetManagerById, useUpdateManager } from '../../../../utils/hooks/useManagers/useManagers';
import ManagersForm from '../ManagersForm/ManagersForm';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useGetCateringById } from '../../../../utils/hooks/useCatering/useCatering';

const EditManager = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

    const { cateringId, managerId } = useParams();
    const { data: catering, isLoading: isLoadingCatering, error: cateringError } = useGetCateringById(Number(cateringId));
    const { data: manager, isLoading: isFetching, error: managerError } = useGetManagerById(Number(cateringId), Number(managerId));
    const { mutateAsync: updateManager, isPending: isUpdating, error: updateManagerError } = useUpdateManager();
    const { mutateAsync: deleteManager, isPending: isDeleting, error: deleteManagerError } = useDeleteManager();

    const error = cateringError || managerError || updateManagerError || deleteManagerError;
    const errorMessage = error ? getErrorMessage(error, 'pages.administrators.') : '';

    const restaurantData = {
        restaurantName: catering?.data.name || '',
        restaurantAddress: catering?.data.address || '',
    };

    const handleDelete = () => {
        setShowConfirmationPopup(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmationPopup(false);
        await deleteManager({ cateringId: Number(cateringId), managerId: Number(managerId) });
        navigate(`/catering/${cateringId}/managers`);
    };

    const onClose = () => {
        navigate('/');
    };

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowConfirmationPopup(false);
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        await updateManager({
            cateringId: Number(cateringId),
            data: {
                managerId: Number(managerId),
                name: data.name,
                password: data.password,
            },
        });
        navigate(`/catering/${cateringId}managers`, {
            state: {
                fromSubmit: true,
            },
        });
    };

    return (
        <>
            <Popup title={t('pages.administrators.editData')} arrowBack onClose={onClose}>
                {(isFetching || isLoadingCatering) && <Preloader />}

                {error && (
                    <div style={{ padding: '0 20px' }}>
                        <ErrorMessage message={errorMessage} />
                    </div>
                )}

                {manager && (
                    <ManagersForm
                        onSubmit={onSubmit}
                        isLoading={isUpdating}
                        defaultValues={{
                            name: manager.data.name,
                            username: manager.data.username,
                            password: '',
                        }}
                        renderDeleteButton={
                            <ButtonGrey type="button" onClick={handleDelete}>
                                {t('pages.administrators.delete')}
                            </ButtonGrey>
                        }
                        edit={true}
                        restaurantData={restaurantData}
                    />
                )}
            </Popup>

            {showConfirmationPopup && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToRemoveTheAdministrator')} confirmButtonText={t('components.confirmationPopup.delete')} onCancel={() => setShowConfirmationPopup(false)} onSubmit={handleConfirmDelete} />
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

export default EditManager;
