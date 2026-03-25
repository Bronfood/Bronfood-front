import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import ButtonUnderline from '../../../../components/ButtonUnderline/ButtonUnderline';
import styles from './CateringDetails.module.scss';
import CateringCard from './CateringCard/CateringCard';
import { useState, MouseEvent, useEffect, useMemo } from 'react';
import ConfirmationPopup from '../../../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import Preloader from '../../../../components/Preloader/Preloader';
import { useDeleteCatering, useGetCateringById, useGetCaterings } from '../../../../utils/hooks/useCatering/useCatering';
import CategoriesList from '../CategoriesList/CategoriesList';
import { useGetCategories } from '../../../../utils/hooks/useCategory/useCategory';
import { useCopyMenu, useGetCateringMeals } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';
import { Catering } from '../../../../utils/api/cateringService/cateringService';

const CateringWithMealsCheck = ({ catering, onCopy }: { catering: Catering; onCopy: () => void }) => {
    const { data: meals, isLoading } = useGetCateringMeals(catering.id);
    if (isLoading) return null;
    if (!meals?.data?.length) return null;
    return <CateringCard card={catering} onCopy={onCopy} />;
};

const CateringDetails = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { cateringId } = useParams();
    const [showConfirmationPopupDelete, setShowConfirmationPopupDelete] = useState(false);
    const [showConfirmationPopupCopy, setShowConfirmationPopupCopy] = useState(false);
    const [cateringCopyId, setCateringCopyId] = useState<number | null>(null);

    const { data: cateringsData, isLoading: isLoadingCaterings } = useGetCaterings();
    const { data: catering, isLoading: isLoadingCatering } = useGetCateringById(Number(cateringId));
    const { data: categories, isLoading: isLoadingCategories } = useGetCategories(Number(cateringId));
    const { data: meals, isLoading: isLoadingMeals } = useGetCateringMeals(Number(cateringId));
    const { mutateAsync: deleteCatering, isPending: isDeleting } = useDeleteCatering();
    const { mutateAsync: copyMenu, isPending: isCopying } = useCopyMenu();

    const caterings = cateringId ? cateringsData?.data.filter((c) => Number(cateringId) !== c.id) : [];

    const categoriesWithPhoto = useMemo(() => {
        if (!categories?.data || !meals?.data) return [];
        return categories.data.map((category) => ({
            ...category,
            photo: category.photo || meals.data.find((meal) => meal.id === category.meal_ids?.[0])?.photo,
        }));
    }, [categories, meals]);

    const handleDeleteClick = () => {
        setShowConfirmationPopupCopy(false);
        setShowConfirmationPopupDelete(true);
    };

    const handleConfirmDelete = async () => {
        await deleteCatering(Number(cateringId));
        setShowConfirmationPopupDelete(false);
        navigate('/');
    };

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowConfirmationPopupDelete(false);
            setShowConfirmationPopupCopy(false);
        }
    };

    const handleCopyClick = (cateringId: number) => {
        setShowConfirmationPopupDelete(false);
        setShowConfirmationPopupCopy(true);
        setCateringCopyId(cateringId);
    };

    const handleCopyMenu = async (fromRestaurantId: number) => {
        await copyMenu({ cateringId: Number(cateringId), fromRestaurantId });
        setShowConfirmationPopupCopy(false);
        setCateringCopyId(null);
    };

    const onClose = () => {
        navigate('/');
    };

    const onEditMenu = () => {
        navigate(`/catering/${cateringId}/menu`);
    };

    const onCollectWeeklyMenu = () => {
        navigate(`/catering/${cateringId}/collect-weekly-menu`);
    };

    const onEditСatering = () => {
        navigate(`/catering/${cateringId}/edit-catering`);
    };

    useEffect(() => {
        document.body.style.overflow = showConfirmationPopupDelete || showConfirmationPopupCopy ? 'hidden' : '';
    }, [showConfirmationPopupDelete, showConfirmationPopupCopy]);

    return (
        <>
            <Popup arrowBack onClose={onClose}>
                {(isLoadingCatering || isLoadingCategories || isLoadingMeals || isLoadingCaterings) && <Preloader />}
                <div className={`${styles['container']} ${styles['container__catering']}`}>
                    <ButtonUnderline onClick={onEditСatering}>{t('pages.cateringManagement.buttonEditCatering')}</ButtonUnderline>
                    {catering && <CateringCard key={catering.data.id} card={catering.data} onDelete={handleDeleteClick} />}
                </div>
                {catering?.data.type === 'businessCenter' && (
                    <div className={`${styles['container']} ${styles['container__collect']}`}>
                        <ButtonUnderline onClick={onCollectWeeklyMenu}>{t('pages.cateringManagement.buttonCollectWeeklyMenu')}</ButtonUnderline>
                    </div>
                )}
                {meals && meals.data.length === 0 ? (
                    <div className={`${styles['container']} ${styles['container__caterings']}`}>
                        <ButtonIconAdd onClick={onEditMenu}>{t('pages.cateringManagement.createNewMenu')}</ButtonIconAdd>
                        {caterings && caterings.length && (
                            <>
                                <p className={styles['container__caterings_text']}>{t('pages.cateringManagement.youCanCopyTheMenuFromTheCateringsYouHave')}</p>
                                {caterings.map((catering) => (
                                    <CateringWithMealsCheck key={catering.id} catering={catering} onCopy={() => handleCopyClick(catering.id)} />
                                ))}
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <div className={`${styles['container']} ${styles['container__menu']}`}>
                            <ButtonUnderline onClick={onEditMenu}>{t('pages.cateringManagement.buttonEditMenu')}</ButtonUnderline>
                        </div>
                        {categories && categories.data.length > 0 && (
                            <div className={styles['container__categories']}>
                                <CategoriesList categories={categoriesWithPhoto} />
                            </div>
                        )}
                    </>
                )}
            </Popup>

            {showConfirmationPopupDelete && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup title={t('components.confirmationPopup.areYouSureYouWantToRemoveTheCatering')} confirmButtonText={t('components.confirmationPopup.delete')} onCancel={() => setShowConfirmationPopupDelete(false)} onSubmit={handleConfirmDelete} />
                    {isDeleting && (
                        <div className={styles['preloader-wrapper']}>
                            <Preloader />
                        </div>
                    )}
                </div>
            )}

            {showConfirmationPopupCopy && cateringCopyId !== null && (
                <div className={styles['confirmation-popup-wrapper']} onClick={handleOverlayClick}>
                    <ConfirmationPopup
                        title={t('components.confirmationPopup.areYouSureYouWantCopyMenu')}
                        confirmButtonText={t('components.confirmationPopup.copy')}
                        onCancel={() => {
                            setShowConfirmationPopupCopy(false);
                            setCateringCopyId(null);
                        }}
                        onSubmit={() => handleCopyMenu(cateringCopyId)}
                    />
                    {isCopying && (
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
