import { useTranslation } from 'react-i18next';
import { useCreateCatering } from '../../../../utils/hooks/useCatering/useCatering';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import RegistrationStepsCatering from '../RegistrationStepsCatering/RegistrationStepsCatering';
import { AddCateringFormValues, DAYS, TYPES } from '../../../../utils/api/cateringService/cateringService';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import { buildCateringFormData } from '../../../../utils/serviceFuncs/cateringFormData';
import { INITIAL_CENTER } from '../../../../utils/consts';

const AddCatering = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = useCreateCatering();
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const cateringData = data as AddCateringFormValues;
        const formData = buildCateringFormData(cateringData);

        const response = await mutateAsync(formData);
        const createdCatering = response.data;
        if (createdCatering?.id) {
            navigate(`/catering/${createdCatering.id}`, {
                state: { catering: createdCatering },
            });
        } else {
            navigate('/');
        }
    };

    return (
        <>
            {isPending && <Preloader />}
            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}
            <RegistrationStepsCatering
                title={t('pages.cateringManagement.registrationCatering')}
                onSubmit={onSubmit}
                defaultValues={{
                    name: '',
                    address: '',
                    description: '',
                    type: TYPES[0],
                    cancellation_time_limit: '',
                    coordinates: { latitude: INITIAL_CENTER[1], longitude: INITIAL_CENTER[0] },
                    legal_name: '',
                    legal_bin: '',
                    legal_address: '',
                    legal_director_fullname: '',
                    tags: [],
                    photo: '',
                    schedule: [...DAYS],
                }}
            />
        </>
    );
};

export default AddCatering;
