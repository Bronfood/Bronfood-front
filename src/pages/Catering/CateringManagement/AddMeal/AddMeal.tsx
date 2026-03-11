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

const AddMeal = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = useCreateCateringMeals();
    const [showThanksPopup, setShowThanksPopup] = useState(false);
    const { cateringId } = useParams();

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description || '');
        formData.append('type', data.type);

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

        await mutateAsync({
            cateringId: Number(cateringId),
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
            {isPending && <Preloader />}
            {error && <ErrorMessage message={error.message} />}
            <RegistrationStepsMeal
                title={t('pages.cateringManagement.titleRegistrationMeal')}
                onSubmit={onSubmit}
                defaultValues={{
                    name: '',
                    description: '',
                    type: 'food',
                    waiting_time: '',
                    photo: '',
                    tags: [],
                    base_price: 0,
                    is_visible: true,
                }}
            />
        </>
    );
};

export default AddMeal;
