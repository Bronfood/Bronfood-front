import { FieldValues, SubmitHandler } from 'react-hook-form';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import RegistrationCategory from '../RegistrationCategory/RegistrationCategory';
import { useCreateCategory } from '../../../../utils/hooks/useCategory/useCategory';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';

const AddCategory = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = useCreateCategory();

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const categoryData = {
            name: data.name,
            photo: data.photo,
            meals: data.meals,
        };

        await mutateAsync(categoryData);
        navigate(-1);
        console.log(data);
    };

    return (
        <Popup title={t('pages.cateringManagement.titleAddCategory')} onClose={onClose}>
            <RegistrationCategory onSubmit={onSubmit} />
            {isPending && <Preloader />}
            {error && <ErrorMessage message={error.message} />}
        </Popup>
    );
};

export default AddCategory;
