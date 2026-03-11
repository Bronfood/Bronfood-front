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

const EditMeal = () => {
    const { t } = useTranslation();
    const { cateringMealId, cateringId } = useParams();
    const navigate = useNavigate();

    const { data: meal, isLoading: isFetching } = useGetCateringMealById(Number(cateringId), Number(cateringMealId));
    const { mutateAsync: updateMeal, isPending, error } = useUpdateCateringMeal();
    const [showThanksPopup, setShowThanksPopup] = useState(false);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description || '');
        formData.append('type', data.type);

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

        await updateMeal({
            cateringId: Number(cateringId),
            cateringMealId: Number(cateringMealId),
            data: formData,
        });
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
            {(isPending || isFetching) && <Preloader />}
            {error && <ErrorMessage message={error.message} />}
            {meal && (
                <RegistrationStepsMeal
                    title={t('pages.cateringManagement.titleEditMeal')}
                    onSubmit={onSubmit}
                    defaultValues={{
                        name: meal.data.name,
                        description: meal.data.description,
                        type: meal.data.type,
                        waiting_time: meal.data.waiting_time,
                        photo: meal.data.photo,
                        tags: meal.data.tags,
                        base_price: meal.data.base_price,
                        is_visible: meal.data.is_visible,
                    }}
                />
            )}
        </>
    );
};

export default EditMeal;
