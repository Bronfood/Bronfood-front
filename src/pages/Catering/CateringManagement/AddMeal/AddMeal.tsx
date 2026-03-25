import RegistrationStepsMeal from '../RegistrationStepsMeal/RegistrationStepsMeal';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useCreateCateringMeals } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import { useState } from 'react';
import PopupAddMealThanks from '../PopupAddMealThanks/PopupAddMealThanks';
import { dataURLtoFile } from '../../../../utils/serviceFuncs/dataURLtoFile';
import { formatCancellationTime } from '../../../../utils/serviceFuncs/formatCancellationTime';
import { Feature } from '../../../../utils/api/cateringMealService/cateringMealService';

const AddMeal = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = useCreateCateringMeals();
    const [showThanksPopup, setShowThanksPopup] = useState(false);
    const { cateringId } = useParams();

    const handleNavigate = () => {
        navigate(`/catering/${cateringId}/menu`);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description || '');

        const photoFile = dataURLtoFile(data.photo, 'photo.jpg');
        formData.append('photo', photoFile);

        formData.append('waiting_time', formatCancellationTime(data.waiting_time));
        if (data.tags.length) {
            data.tags.forEach((tag: { name: string }, index: number) => {
                formData.append(`tags[${index}]name`, tag.name);
            });
        }
        formData.append('base_price', data.base_price);
        formData.append('is_visible', String(data.is_visible));

        if (data.features && data.features.length > 0) {
            data.features.forEach((feature: Feature, fIndex: number) => {
                formData.append(`features[${fIndex}]name`, feature.name);

                if (feature.id > 0) {
                    formData.append(`features[${fIndex}]id`, String(feature.id));
                }

                feature.choices.forEach((choice, cIndex: number) => {
                    formData.append(`features[${fIndex}]choices[${cIndex}]name`, choice.name);
                    formData.append(`features[${fIndex}]choices[${cIndex}]price`, String(choice.price));

                    if (choice.id > 0) {
                        formData.append(`features[${fIndex}]choices[${cIndex}]id`, String(choice.id));
                    }
                });
            });
        }

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
            {error && <ErrorMessage message={error.message} />}
            <RegistrationStepsMeal
                title={t('pages.cateringManagement.titleRegistrationMeal')}
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
                    features: [],
                }}
            />
        </>
    );
};

export default AddMeal;
