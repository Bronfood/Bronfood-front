import { FieldValues, SubmitHandler } from 'react-hook-form';
import Popup from '../../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import RegistrationCategory from '../RegistrationCategory/RegistrationCategory';
import { useCreateCategory } from '../../../../utils/hooks/useCategory/useCategory';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';

const AddCategory = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { mutateAsync, isPending, error } = useCreateCategory();
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        await mutateAsync({
            cateringId: Number(cateringId),
            data: {
                name: data.name,
                meal_ids: data.meal_ids || [],
            },
        });
        navigate(`/catering/${cateringId}/menu`, {
            state: {
                fromSubmit: true,
            },
        });
    };

    return (
        <Popup title={t('pages.cateringManagement.addingCategory')} onClose={onClose}>
            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}
            <RegistrationCategory onSubmit={onSubmit} />
            {isPending && <Preloader />}
        </Popup>
    );
};

export default AddCategory;
