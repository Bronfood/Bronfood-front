import RegistrationStepsMeal from '../RegistrationStepsMeal/RegistrationStepsMeal';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useCreateCateringMeal } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import { useState } from 'react';
import PopupAddMealThanks from '../PopupAddMealThanks/PopupAddMealThanks';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import { PRESET_SIZE_FEATURE_ID } from '../../../../utils/consts';
import { formatMinutesToTime } from '../../../../utils/serviceFuncs/formatMinutesToTime';
import { buildMealFormData } from '../../../../utils/serviceFuncs/mealFormData';
import { AddMealFormValues } from '../../../../utils/api/cateringMealService/cateringMealService';

const AddMeal = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = useCreateCateringMeal();
    const [showThanksPopup, setShowThanksPopup] = useState(false);
    const { cateringId } = useParams();
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const handleNavigate = () => {
        navigate(`/catering/${cateringId}/menu`);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const mealData = data as AddMealFormValues;

        const formData = buildMealFormData({
            ...mealData,
            waiting_time: formatMinutesToTime(mealData.waiting_time),
        });

        await mutateAsync({
            cateringId: Number(cateringId),
            data: formData,
        });
        setShowThanksPopup(true);
    };

    if (showThanksPopup) {
        return <PopupAddMealThanks onNavigate={handleNavigate} />;
    }

    return (
        <>
            {isPending && <Preloader />}
            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}
            <RegistrationStepsMeal
                title={t('pages.cateringManagement.registrationMeal')}
                onSubmit={onSubmit}
                defaultValues={{
                    name: '',
                    description: '',
                    category: null,
                    waiting_time: '',
                    photo: '',
                    tags: [],
                    base_price: '',
                    is_visible: true,
                    features: [
                        {
                            id: PRESET_SIZE_FEATURE_ID,
                            name: 'Размер',
                            selection_type: 'single',
                            pricing_strategy: 'override',
                            choices: [
                                {
                                    id: -Date.now(),
                                    name: 'Стандартный',
                                    price: 20,
                                    is_visible: true,
                                    is_default: true,
                                },
                            ],
                        },
                    ],
                }}
            />
        </>
    );
};

export default AddMeal;
