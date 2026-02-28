import { FC, useState } from 'react';
import Popup from '../../components/Popups/Popup/Popup';
import Form from '../../components/Form/Form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FormInputs from '../../components/FormInputs/FormInputs';
import Input from '../../components/Input/Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { regexClientName, regexEmail, regexMessage } from '../../utils/consts';
import InputPhone from '../../components/InputPhone/InputPhone';
import Textarea from '../../components/Textarea/Textarea';
import Button from '../../components/Button/Button';
import InputImage from '../../components/InputImage/InputImage';
import PopupThanks from '../../components/Popups/PopupThanks/PopupThanks';
import InfoImage from '../../components/InfoImage/InfoImage';
import Preloader from '../../components/Preloader/Preloader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './Support.module.scss';
import { useSupport } from '../../utils/hooks/useSupport/useSupport';
import { dataURLtoFile } from '../../utils/serviceFuncs/dataURLtoFile';
import { formatPhoneNumber } from '../../utils/serviceFuncs/formatPhoneNumber';

const Support: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = useSupport();
    const [showPopup, setShowPopup] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const values = watch();
    const [previewImages, setPreviewImages] = useState<string[] | null>(values.imageFormSupport ? (Array.isArray(values.imageFormSupport) ? values.imageFormSupport : [values.imageFormSupport]) : null);

    const onClose = () => {
        navigate('/');
    };

    const handleImageUpload = (images: string[] | null) => {
        setPreviewImages(images);
        setValue('imageFormSupport', images || '', { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData();
        formData.append('name', data.nameClient);
        formData.append('phone', formatPhoneNumber(data.phoneNumber));
        formData.append('email', data.emailClient);
        formData.append('message', data.messageClient);

        if (previewImages && previewImages.length > 0) {
            previewImages.forEach((imageStr, index) => {
                const file = dataURLtoFile(imageStr, `image-${index}.png`);
                formData.append('images', file);
            });
        }

        await mutateAsync(formData);
        setShowPopup(true);
    };

    if (showPopup) {
        return <PopupThanks title={t('pages.popupSupportThanks.title')} description={t('pages.popupSupportThanks.description')} image={<InfoImage mode="without_tube" />} />;
    }

    return (
        <Popup title={t('pages.support.title')} onClose={onClose}>
            {isPending && <Preloader />}
            <Form name="form-support" onSubmit={handleSubmit(onSubmit)}>
                <FormInputs>
                    <Input type="text" name="nameClient" placeholder={t('pages.support.placeholderNameClient')} nameLabel={t('pages.support.nameLabelNameClient')} register={register} errors={errors} pattern={regexClientName} />
                    <InputPhone register={register} errors={errors} />
                    <Input type="text" name="emailClient" placeholder={t('pages.support.placeholderEmailClient')} nameLabel={t('pages.support.nameLabelEmailClient')} register={register} errors={errors} pattern={regexEmail} />
                    <Textarea name="messageClient" placeholder={t('pages.support.placeholderMessageClient')} nameLabel={t('pages.support.nameLabelMessageClient')} register={register} errors={errors} pattern={regexMessage} required />
                    <InputImage nameLabel={t('pages.support.nameLabelPhoto')} name="imageFormSupport" register={register} errors={errors} onChange={handleImageUpload} previewImages={previewImages} multiple={true} maxFiles={5} editing={true} deleting={true} />
                </FormInputs>
                <Button type="submit">{t('pages.support.buttonSendRequest')}</Button>
            </Form>
            {error && (
                <div className={styles.error}>
                    <ErrorMessage message={error.message} />
                </div>
            )}
        </Popup>
    );
};

export default Support;
