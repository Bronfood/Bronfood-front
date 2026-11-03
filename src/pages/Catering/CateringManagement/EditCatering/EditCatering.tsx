import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useTranslation } from 'react-i18next';
import RegistrationStepsCatering from '../RegistrationStepsCatering/RegistrationStepsCatering';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useGetCateringById, useUpdateCatering } from '../../../../utils/hooks/useCatering/useCatering';
import { EditCateringFormValues } from '../../../../utils/api/cateringService/cateringService';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';
import { formatWaitingTime } from '../../../../utils/serviceFuncs/formatTime';
import { INITIAL_CENTER } from '../../../../utils/consts';
import { buildCateringFormData } from '../../../../utils/serviceFuncs/cateringFormData';

const EditCatering = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { data: catering, isLoading: isLoadingCatering, error: cateringError } = useGetCateringById(Number(cateringId));
    const { mutateAsync: updateCatering, isPending, error: updateCateringError } = useUpdateCatering();
    const error = cateringError || updateCateringError;
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const normalizedSchedule = catering?.data.schedule.map((day) => ({
        ...day,
        open_time: day.open_time?.slice(0, 5) || null,
        close_time: day.close_time?.slice(0, 5) || null,
    }));

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const cateringData = data as EditCateringFormValues;
        const formData = buildCateringFormData(cateringData);

        const response = await updateCatering({
            cateringId: Number(cateringId),
            data: formData,
        });
        const updatedCatering = response.data;

        if (updatedCatering?.id) {
            navigate(`/catering/${cateringId}`);
        } else {
            navigate('/');
        }
    };

    return (
        <>
            {(isPending || isLoadingCatering) && <Preloader />}

            {error && (
                <div style={{ padding: '0 20px' }}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}

            {catering && (
                <RegistrationStepsCatering
                    title={t('pages.cateringManagement.editingCatering')}
                    onSubmit={onSubmit}
                    defaultValues={{
                        name: catering.data.name,
                        address: catering.data.address,
                        description: catering.data.description,
                        type: catering.data.type,
                        cancellation_time_limit: formatWaitingTime(catering.data.cancellation_time_limit),
                        coordinates: {
                            latitude: catering.data.coordinates?.latitude ?? INITIAL_CENTER[1],
                            longitude: catering.data.coordinates?.longitude ?? INITIAL_CENTER[0],
                        },
                        legal_name: catering.data.legal_name,
                        legal_bin: catering.data.legal_bin,
                        legal_address: catering.data.legal_address,
                        legal_director_fullname: catering.data.legal_director_fullname,
                        tags: catering.data.tags,
                        photo: catering.data.photo,
                        schedule: normalizedSchedule,
                    }}
                />
            )}
        </>
    );
};

export default EditCatering;
