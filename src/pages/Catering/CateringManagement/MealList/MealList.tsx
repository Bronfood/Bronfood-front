import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import styles from './MealList.module.scss';
import ButtonIconAdd from '../../../../components/ButtonIconAdd/ButtonIconAdd';
import MealItem from './MealItem/MealItem';
import { useDeleteCateringMeal, useGetCateringMeals } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';

const MealList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { data, isSuccess, isPending } = useGetCateringMeals();
    const { mutateAsync: deleteMeal } = useDeleteCateringMeal();
    const meals = isSuccess ? data.data : [];
    const [isOpen, setIsOpen] = useState<number | null>(null);

    const onCloseClick = () => {
        navigate('/catering');
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
        await deleteMeal(Number(id));
    };

    return (
        <Popup title={t('pages.cateringManagement.titleMealMenu')} arrowBack={true} onClose={onCloseClick}>
            <div className={styles.buttons}>
                <ButtonIconAdd>{t('pages.cateringManagement.addCategoriesMenu')}</ButtonIconAdd>
                <ButtonIconAdd onClick={addMealClick}>{t('pages.cateringManagement.addMealToList')}</ButtonIconAdd>
            </div>

            {isPending && <Preloader />}
            {meals.length > 0 && (
                <ul className={styles.list}>
                    {meals.map((meal) => (
                        <MealItem key={meal.id} onClickInfo={() => toggleClick(meal.id)} meal={meal} isOpen={isOpen === meal.id} onDelete={() => deleteMealClick(meal.id)} onEdit={() => editMealClick(meal.id)} />
                    ))}
                </ul>
            )}
        </Popup>
    );
};

export default MealList;
