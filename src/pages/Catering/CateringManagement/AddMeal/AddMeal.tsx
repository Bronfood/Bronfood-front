import RegistrationStepsMeal from '../RegistrationStepsMeal/RegistrationStepsMeal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useCreateCateringMeals } from '../../../../utils/hooks/useCateringMeal/useCateringMeal';

const AddMeal = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = useCreateCateringMeals();

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const mealData = {
            photo: data.photo,
            name: data.name,
            price: data.price,
            disposableTableware: data.disposableTableware,
            mealSizes: data.mealSizes,
            type: data.type,
            waitingTime: data.waitingTime,
            tags: data.tags,
        };
        const response = await mutateAsync(mealData);
        const createCateringMeal = response.data;

        navigate('/catering', {
            state: { catering: createCateringMeal },
        });
    };

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
                    price: undefined,
                }}
            />
        </>
    );
};

export default AddMeal;
