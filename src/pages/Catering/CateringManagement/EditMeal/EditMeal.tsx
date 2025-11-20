import { useTranslation } from 'react-i18next';
import RegistrationStepsMeal from '../RegistrationStepsMeal/RegistrationStepsMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetMealById, useUpdateMeal } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import PopupAddMealThanks from '../PopupAddMealThanks/PopupAddMealThanks';

const EditMeal = () => {
    const { t } = useTranslation();
    const { mealId, cateringId } = useParams();
    const navigate = useNavigate();

    const { data: meal, isLoading: isFetching } = useGetMealById(Number(mealId));
    const { mutateAsync: updateMeal, isPending, error } = useUpdateMeal();
    const [showThanksPopup, setShowThanksPopup] = useState(false);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const mealData = {
            id: Number(mealId),
            photo: data.photo,
            name: data.name,
            description: data.description,
            price: data.price,
            disposableTableware: data.disposableTableware,
            mealSizes: data.mealSizes,
            mealSauces: data.mealSauces,
            mealAdditives: data.mealAdditives,
            type: data.type,
            waitingTime: data.waitingTime,
            tags: data.tags,
            is_visible: data.is_visible,
        };

        await updateMeal(mealData);
        setShowThanksPopup(true);
    };

    const handleNavigate = () => {
        navigate(`/catering/${cateringId}/menu`);
    };

    if (showThanksPopup) {
        return <PopupAddMealThanks onNavigate={handleNavigate} />;
    }

    return (
        <>
            {isPending || (isFetching && <Preloader />)}
            {error && <ErrorMessage message={error.message} />}
            {meal && (
                <RegistrationStepsMeal
                    title={t('pages.cateringManagement.titleEditMeal')}
                    onSubmit={onSubmit}
                    defaultValues={{
                        photo: meal.data.photo,
                        name: meal.data.name,
                        description: meal.data.description,
                        price: meal.data.price,
                        disposableTableware: meal.data.disposableTableware,
                        mealSizes: meal.data.mealSizes,
                        mealSauces: meal.data.mealSauces,
                        mealAdditives: meal.data.mealAdditives,
                        type: meal.data.type,
                        waitingTime: meal.data.waitingTime,
                        tags: meal.data.tags,
                        is_visible: meal.data.is_visible,
                    }}
                />
            )}
        </>
    );
};

export default EditMeal;
