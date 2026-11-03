import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import ManagersForm from '../ManagersForm/ManagersForm';
import { useCreateManager } from '../../../../utils/hooks/useManagers/useManagers';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import { useGetCateringById } from '../../../../utils/hooks/useCatering/useCatering';

const AddManager = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { data: catering, isLoading, error: cateringError } = useGetCateringById(Number(cateringId));
    const { mutateAsync, isPending, error: createManagerError } = useCreateManager();

    const error = cateringError || createManagerError;
    const errorMessage = error ? getErrorMessage(error, 'pages.administrators.') : '';

    const restaurantData = {
        restaurantName: catering?.data.name || '',
        restaurantAddress: catering?.data.address || '',
    };

    const onClose = () => {
        navigate('/');
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        await mutateAsync({
            cateringId: Number(cateringId),
            data: {
                username: data.username,
                name: data.name,
                password: data.password,
            },
        });
        navigate(`/catering/${cateringId}/managers`, {
            state: {
                fromSubmit: true,
            },
        });
    };

    return (
        <Popup title={t('pages.administrators.createUsernameAndPassword')} arrowBack onClose={onClose}>
            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}

            {(isPending || isLoading) && <Preloader />}

            <ManagersForm
                onSubmit={onSubmit}
                isLoading={isPending}
                defaultValues={{
                    name: '',
                    username: '',
                    password: '',
                }}
                restaurantData={restaurantData}
            />
        </Popup>
    );
};

export default AddManager;
