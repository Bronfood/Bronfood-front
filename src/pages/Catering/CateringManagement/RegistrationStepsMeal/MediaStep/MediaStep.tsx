import InputImage from '../../../../../components/InputImage/InputImage';
import styles from './MediaStep.module.scss';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import Input from '../../../../../components/Input/Input';
import { CropState, regexClientName, regexNumber } from '../../../../../utils/consts';
import FormInputs from '../../../../../components/FormInputs/FormInputs';

interface MediaStepProps {
    cropState: CropState;
    onCropStateChange: (state: CropState) => void;
}

const MediaStep = ({ cropState, onCropStateChange }: MediaStepProps) => {
    const { t } = useTranslation();
    const {
        register,
        watch,
        formState: { errors },
        setValue,
    } = useFormContext();
    const values = watch();
    const photoValue = watch('photo');
    const previewImage = typeof photoValue === 'string' ? photoValue : null;

    const handleImageUpload = (image: string | string[] | null) => {
        const currentImage = typeof image === 'string' ? image : null;
        setValue('photo', currentImage || '', { shouldValidate: true });
    };

    return (
        <fieldset className={styles.fieldset}>
            <FormInputs>
                <InputImage nameLabel={t('pages.cateringManagement.nameLabelPhotoMeal')} name="photo" register={register} errors={errors} onChange={handleImageUpload} previewImages={previewImage} editing crop={{ targetWidth: 375, targetHeight: 180 }} cropState={cropState} onCropStateChange={onCropStateChange} />
                <Input type="text" nameLabel={t('pages.cateringManagement.nameLabelName')} placeholder={t('pages.cateringManagement.placeholderNameMeal')} name="name" register={register} errors={errors} pattern={regexClientName} value={values.name} />
                <Input type="number" nameLabel={t('pages.cateringManagement.nameLabelPrice')} placeholder={t('pages.cateringManagement.placeholderPrice')} name="base_price" register={register} errors={errors} pattern={regexNumber} value={values.base_price} />
            </FormInputs>
        </fieldset>
    );
};

export default MediaStep;
