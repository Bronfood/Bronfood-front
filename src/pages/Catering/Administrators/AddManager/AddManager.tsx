import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import ManagersForm from '../ManagersForm/ManagersForm';
import { useCreateManager } from '../../../../utils/hooks/useManagers/useManagers';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';

const AddManager = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { mutateAsync, isPending, error } = useCreateManager();
    const errorMessage = error ? getErrorMessage(error, 'pages.administrators.') : '';

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
            {isPending && <Preloader />}
            <ManagersForm onSubmit={onSubmit} isLoading={isPending} />
        </Popup>
    );
};

export default AddManager;
