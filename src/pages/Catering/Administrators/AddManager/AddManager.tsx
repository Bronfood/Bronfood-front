import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../../components/Popups/Popup/Popup';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import ManagersForm from '../ManagersForm/ManagersForm';
import { useCreateManager } from '../../../../utils/hooks/useManagers/useManagers';

const AddManager = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { mutateAsync, isPending, error } = useCreateManager();

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

    const onClose = () => {
        navigate('/');
    };

    return (
        <Popup title={t('pages.administrators.titleCreate')} arrowBack onClose={onClose}>
            {isPending && <Preloader />}
            {error && <ErrorMessage message={error.message} />}
            <ManagersForm onSubmit={onSubmit} isLoading={isPending} />
        </Popup>
    );
};

export default AddManager;
