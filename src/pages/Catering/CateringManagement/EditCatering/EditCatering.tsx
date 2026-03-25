import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useTranslation } from 'react-i18next';
import RegistrationStepsCatering from '../RegistrationStepsCatering/RegistrationStepsCatering';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useGetCateringById, useUpdateCatering } from '../../../../utils/hooks/useCatering/useCatering';
import { Day } from '../../../../utils/api/cateringService/cateringService';
import { dataURLtoFile } from '../../../../utils/serviceFuncs/dataURLtoFile';
import { getErrorMessage } from '../../../../utils/serviceFuncs/getErrorMessage';

const EditCatering = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();
    const { data: catering, isLoading: isLoadingCatering } = useGetCateringById(Number(cateringId));
    const { mutateAsync: updateCatering, isPending, error } = useUpdateCatering();
    const errorMessage = error ? getErrorMessage(error, 'pages.cateringManagement.') : '';

    const normalizedSchedule = catering?.data.schedule.map((day) => ({
        ...day,
        open_time: day.open_time?.slice(0, 5) || null,
        close_time: day.close_time?.slice(0, 5) || null,
    }));

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('address', data.address);
        formData.append('description', data.description || '');
        formData.append('type', data.type);
        formData.append('cancellation_time_limit', data.cancellation_time_limit);
        formData.append('longitude', String(data.coordinates?.longitude || ''));
        formData.append('latitude', String(data.coordinates?.latitude || ''));

        formData.append('legal_name', data.legal_name);
        formData.append('legal_bin', data.legal_bin);
        formData.append('legal_address', data.legal_address);
        formData.append('legal_director_fullname', data.legal_director_fullname);

        if (data.photo) {
            if (typeof data.photo === 'string' && data.photo.startsWith('data:')) {
                const photoFile = dataURLtoFile(data.photo, 'photo.jpg');
                formData.append('photo', photoFile);
            } else if (data.photo instanceof File) {
                formData.append('photo', data.photo);
            }
        }

        if (data.tags.length) {
            data.tags.forEach((tag: { name: string }, index: number) => {
                formData.append(`tags[${index}]name`, tag.name);
            });
        }

        if (data.schedule) {
            data.schedule.forEach((day: Day, index: number) => {
                formData.append(`schedule[${index}]weekday`, String(day.weekday));
                formData.append(`schedule[${index}]open_time`, day.open_time || '');
                formData.append(`schedule[${index}]close_time`, day.close_time || '');
            });
        }

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
                        cancellation_time_limit: catering.data.cancellation_time_limit,
                        coordinates: { latitude: catering.data.coordinates?.latitude, longitude: catering.data.coordinates?.longitude },
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
