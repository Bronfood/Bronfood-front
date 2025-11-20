import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import ButtonUnderline from '../../../../components/ButtonUnderline/ButtonUnderline';
import styles from './CateringDetails.module.scss';
import CategoriesList from './CategoriesList/CategoriesList';
import CateringCard from './CateringCard/CateringCard';
import { useState, MouseEvent, useEffect } from 'react';
import ConfirmationPopup from '../../../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import Preloader from '../../../../components/Preloader/Preloader';
import { useDeleteCatering, useGetCateringById } from '../../../../utils/hooks/useCatering/useCatering';

const CateringDetails = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { cateringId } = useParams();

    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const { data: сatering, isLoading: isFetching } = useGetCateringById(Number(cateringId));
    const { mutateAsync: deleteCatering, isPending: isDeleting } = useDeleteCatering();

    useEffect(() => {
        document.body.style.overflow = showConfirmationPopup ? 'hidden' : '';
    }, [showConfirmationPopup]);

    const handleDeleteClick = () => {
        setShowConfirmationPopup(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmationPopup(false);
        await deleteCatering(Number(cateringId));
        navigate('/');
    };

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowConfirmationPopup(false);
        }
    };

    const onClose = () => {
        navigate('/');
    };

    const onEditMenu = () => {
        navigate(`/catering/${cateringId}/menu`);
    };

    const onEditСatering = () => {
        navigate(`/catering/${cateringId}/edit`);
    };

    return (
        <>
            <Popup arrowBack onClose={onClose}>
                {isFetching && <Preloader />}
                <div className={`${styles['container']} ${styles['container__catering']}`}>
                    <ButtonUnderline onClick={onEditСatering}>{t('pages.cateringManagement.buttonEditCatering')}</ButtonUnderline>
                    {сatering && <CateringCard card={сatering.data} onDelete={handleDeleteClick} />}
                </div>
                <div className={`${styles['container']} ${styles['container__menu']}`}>
                    <ButtonUnderline onClick={onEditMenu}>{t('pages.cateringManagement.buttonEditMenu')}</ButtonUnderline>
                    <CategoriesList />
                </div>
            </Popup>
            {showConfirmationPopup && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToRemoveTheCatering')} confirmButtonText={t('components.confirmationPopup.delete')} onCancel={() => setShowConfirmationPopup(false)} onSubmit={handleConfirmDelete} />
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

export default CateringDetails;
