import { useTranslation } from 'react-i18next';
import RegistrationStepsMeal from '../RegistrationStepsMeal/RegistrationStepsMeal';
import Preloader from '../../../../components/Preloader/Preloader';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCateringMealById, useUpdateCateringMeal } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import PopupAddMealThanks from '../PopupAddMealThanks/PopupAddMealThanks';
import { formatCancellationTime } from '../../../../utils/serviceFuncs/formatCancellationTime';
import { dataURLtoFile } from '../../../../utils/serviceFuncs/dataURLtoFile';
import { Feature } from '../../../../utils/api/cateringMealService/cateringMealService';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';

const EditMeal = () => {
    const { t } = useTranslation();
    const { cateringMealId, cateringId } = useParams();
    const navigate = useNavigate();
    const { data: meal, isLoading: isFetching } = useGetCateringMealById(Number(cateringId), Number(cateringMealId));
    const { mutateAsync: updateMeal, isPending, error } = useUpdateCateringMeal();
    const [showThanksPopup, setShowThanksPopup] = useState(false);
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const handleNavigate = () => {
        navigate(`/catering/${cateringId}/menu`);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description || '');

        if (data.photo) {
            if (typeof data.photo === 'string' && data.photo.startsWith('data:')) {
                const photoFile = dataURLtoFile(data.photo, 'photo.jpg');
                formData.append('photo', photoFile);
            } else if (data.photo instanceof File) {
                formData.append('photo', data.photo);
            }
        }

        if (data.tags.length) {
            data.tags.forEach((tag: { name: string }, index: number) => {
                formData.append(`tags[${index}]name`, tag.name);
            });
        }

        formData.append('waiting_time', formatCancellationTime(data.waiting_time));
        formData.append('base_price', data.base_price);
        formData.append('is_visible', String(data.is_visible));

        if (data.features && data.features.length > 0) {
            data.features.forEach((feature: Feature, fIndex: number) => {
                if (feature.id > 0) {
                    formData.append(`features[${fIndex}]id`, String(feature.id));
                }
                formData.append(`features[${fIndex}]name`, feature.name);

                feature.choices.forEach((choice, cIndex: number) => {
                    if (choice.id > 0) {
                        formData.append(`features[${fIndex}]choices[${cIndex}]id`, String(choice.id));
                    }
                    formData.append(`features[${fIndex}]choices[${cIndex}]name`, choice.name);
                    formData.append(`features[${fIndex}]choices[${cIndex}]price`, String(choice.price));
                });
            });
        }

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
                        waiting_time: meal.data.waiting_time,
                        photo: meal.data.photo,
                        tags: meal.data.tags,
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
