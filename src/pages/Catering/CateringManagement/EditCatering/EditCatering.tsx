import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../../../../components/Preloader/Preloader';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import { useTranslation } from 'react-i18next';
import RegistrationStepsCatering from '../RegistrationStepsCatering/RegistrationStepsCatering';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useGetCateringById, useUpdateCatering } from '../../../../utils/hooks/useCatering/useCatering';
import { TYPES } from '../../../../utils/api/cateringService/cateringService';

const EditCatering = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cateringId } = useParams();

    const { data: catering, isLoading: isLoadingCatering } = useGetCateringById(Number(cateringId));
    const { mutateAsync: updateCatering, isPending, error } = useUpdateCatering();

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const cateringData = {
            id: Number(cateringId),
            name: data.name,
            address: data.address,
            description: data.description,
            coordinates: data.coordinates,
            type: data.type.name,
            cancellationTime: data.cancellationTime,
            photo: data.photo,
            rating: data.rating,
            tags: data.tags,
            workingTime: data.workingTime,
            categories: data.categories,
        };

        const response = await updateCatering(cateringData);
        const updatedCatering = response.data;

        if (updatedCatering?.id) {
            navigate(`/catering/${cateringId}`);
        } else {
            navigate('/');
        }
    };

    return (
        <>
            {isPending || (isLoadingCatering && <Preloader />)}
            {error && <ErrorMessage message={error.message} />}
            {catering && (
                <RegistrationStepsCatering
                    title={t('pages.cateringManagement.titleEditCatering')}
                    onSubmit={onSubmit}
                    defaultValues={{
                        type: TYPES.find((t) => t.name === catering.data.type),
                        tags: catering.data.tags,
                        name: catering.data.name,
                        address: catering.data.address,
                        description: catering.data.description,
                        coordinates: catering.data.coordinates,
                        cancellationTime: catering.data.cancellationTime,
                        rating: catering.data.rating,
                        photo: catering.data.photo,
                        workingTime: catering.data.workingTime,
                        categories: catering.data.categories,
                    }}
                />
            )}
        </>
    );
};

export default EditCatering;
