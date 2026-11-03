import { useTranslation } from 'react-i18next';
import RegistrationStepsMeal from '../RegistrationStepsMeal/RegistrationStepsMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCateringMealById, useUpdateCateringMeal } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useState } from 'react';
import PopupAddMealThanks from '../PopupAddMealThanks/PopupAddMealThanks';
import { EditMealFormValues } from '../../../../utils/api/cateringMealService/cateringMealService';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import { formatMinutesToTime } from '../../../../utils/serviceFuncs/formatMinutesToTime';
import { formatWaitingTime } from '../../../../utils/serviceFuncs/formatTime';
import { buildMealFormData } from '../../../../utils/serviceFuncs/mealFormData';
import { FieldValues, SubmitHandler } from 'react-hook-form';

const EditMeal = () => {
    const { t } = useTranslation();
    const { cateringMealId, cateringId } = useParams();
    const navigate = useNavigate();
    const { data: meal, isLoading: isFetching, error: mealError } = useGetCateringMealById(Number(cateringId), Number(cateringMealId));
    const { mutateAsync: updateMeal, isPending, error: updateMealError } = useUpdateCateringMeal();
    const [showThanksPopup, setShowThanksPopup] = useState(false);
    const error = mealError || updateMealError;
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const handleNavigate = () => {
        navigate(`/catering/${cateringId}/menu`);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const mealData = data as EditMealFormValues;

        const formData = buildMealFormData({
            ...mealData,
            id: Number(cateringMealId),
            waiting_time: formatMinutesToTime(mealData.waiting_time),
        });

        await updateMeal({
            cateringId: Number(cateringId),
            cateringMealId: Number(cateringMealId),
            data: formData,
        });
        setShowThanksPopup(true);
    };

    if (showThanksPopup) {
        return <PopupAddMealThanks onNavigate={handleNavigate} />;
    }

    return (
        <>
            {(isPending || isFetching) && <Preloader />}
            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}
            {meal && (
                <RegistrationStepsMeal
                    title={t('pages.cateringManagement.editingMeal')}
                    onSubmit={onSubmit}
                    defaultValues={{
                        name: meal.data.name,
                        description: meal.data.description,
                        category: meal.data.category,
                        waiting_time: formatWaitingTime(meal.data.waiting_time),
                        photo: meal.data.photo,
                        tags: meal.data.tags || [],
                        base_price: meal.data.base_price,
                        is_visible: meal.data.is_visible,
                        features: meal.data.features,
                    }}
                />
            )}
        </>
    );
};

export default EditMeal;
