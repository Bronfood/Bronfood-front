import { useTranslation } from 'react-i18next';
import { useCreateCatering } from '../../../../utils/hooks/useCatering/useCatering';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import RegistrationStepsCatering from '../RegistrationStepsCatering/RegistrationStepsCatering';
import { Day, DAYS, TYPES } from '../../../../utils/api/cateringService/cateringService';
import { dataURLtoFile } from '../../../../utils/serviceFuncs/dataURLtoFile';

const AddCatering = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { mutateAsync, isPending, error } = useCreateCatering();

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

        const photoFile = dataURLtoFile(data.photo, 'photo.jpg');
        formData.append('photo', photoFile);
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
            {error && <ErrorMessage message={error.message} />}
            <RegistrationStepsCatering
                title={t('pages.cateringManagement.registrationCatering')}
                onSubmit={onSubmit}
                defaultValues={{
                    name: '',
                    address: '',
                    description: '',
                    type: TYPES[0],
                    cancellation_time_limit: '',
                    coordinates: { latitude: 43.246345, longitude: 76.921552 },
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
