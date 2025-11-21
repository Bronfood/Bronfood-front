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

const GeneralSupport: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showPopup, setShopPopup] = useState(false);

    const onClose = () => {
        navigate('/');
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const values = watch();
    const [previewImages, setPreviewImages] = useState<string[] | null>(values.imageFormSupport ? (Array.isArray(values.imageFormSupport) ? values.imageFormSupport : [values.imageFormSupport]) : null);

    const handleImageUpload = (images: string[] | null) => {
        setPreviewImages(images);
        setValue('imageFormSupport', images || '', { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<FieldValues> = () => {
        setShopPopup(true);
    };

    if (showPopup) {
        return <PopupThanks title={t('pages.popupGeneralSupportThanks.title')} description={t('pages.popupGeneralSupportThanks.description')} image={<InfoImage mode="without_tube" />} />;
    }

    return (
        <Popup title={t('pages.generalSupport.title')} onClose={onClose}>
            <Form name="general-form-help" onSubmit={handleSubmit(onSubmit)}>
                <FormInputs>
                    <Input type="text" name="nameClient" placeholder={t('pages.generalSupport.placeholderNameClient')} nameLabel={t('pages.generalSupport.nameLabelNameClient')} register={register} errors={errors} pattern={regexClientName} />
                    <InputPhone register={register} errors={errors} />
                    <Input type="text" name="emailClient" placeholder={t('pages.generalSupport.placeholderEmailClient')} nameLabel={t('pages.generalSupport.nameLabelEmailClient')} register={register} errors={errors} pattern={regexEmail} />
                    <Textarea name="messageClient" placeholder={t('pages.generalSupport.placeholderMessageClient')} nameLabel={t('pages.generalSupport.nameLabelMessageClient')} register={register} errors={errors} pattern={regexMessage} />
                    <InputImage nameLabel={t('pages.generalSupport.nameLabelPhoto')} name="imageFormSupport" register={register} errors={errors} onChange={handleImageUpload} previewImages={previewImages} multiple={true} maxFiles={5} editing={true} deleting={true} />
                </FormInputs>
                <Button type="submit">{t('pages.generalSupport.buttonSendRequest')}</Button>
            </Form>
        </Popup>
    );
};

export default GeneralSupport;
