import RegistrationStepsMeal from '../RegistrationStepsMeal/RegistrationStepsMeal';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useCreateCateringMeals } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import { useState } from 'react';
import PopupAddMealThanks from '../PopupAddMealThanks/PopupAddMealThanks';

const AddMeal = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = useCreateCateringMeals();
    const [showThanksPopup, setShowThanksPopup] = useState(false);
    const { cateringId } = useParams();

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const mealData = {
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
        await mutateAsync(mealData);
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
            {isPending && <Preloader />}
            {error && <ErrorMessage message={error.message} />}
            <RegistrationStepsMeal
                title={t('pages.cateringManagement.titleRegistrationMeal')}
                onSubmit={onSubmit}
                defaultValues={{
                    photo: '',
                    name: '',
                    description: '',
                    price: undefined,
                    disposableTableware: false,
                    mealSizes: [],
                    mealSauces: [],
                    mealAdditives: [],
                    type: '',
                    waitingTime: undefined,
                    tags: [],
                    is_visible: true,
                }}
            />
        </>
    );
};

export default AddMeal;
