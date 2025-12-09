import { FieldValues, SubmitHandler } from 'react-hook-form';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import RegistrationCategory from '../RegistrationCategory/RegistrationCategory';
import Preloader from '../../../../components/Preloader/Preloader';
import { useGetCategoryById } from '../../../../utils/hooks/useCategory/useCategory';

const EditCategory = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const onClose = () => {
        navigate(-1);
    };
    const { data: category, isLoading } = useGetCategoryById(Number(categoryId));

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        console.log(data);
    };

    return (
        <Popup title={t('pages.cateringManagement.titleEditCategory')} onClose={onClose}>
            {isLoading && <Preloader />}
            {category && (
                <RegistrationCategory
                    onSubmit={onSubmit}
                    defaultValues={{
                        name: category?.data.name || '',
                        photo: category?.data.photo || '',
                        meals: category?.data.meals || [],
                    }}
                />
            )}
        </Popup>
    );
};

export default EditCategory;
