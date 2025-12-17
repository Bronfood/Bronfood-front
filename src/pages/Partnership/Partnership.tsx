import { FC, useState } from 'react';
import Popup from '../../components/Popups/Popup/Popup';
import Form from '../../components/Form/Form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FormInputs from '../../components/FormInputs/FormInputs';
import Input from '../../components/Input/Input';
import { regexAddress, regexClientName, regexEmail, regexMessage } from '../../utils/consts';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../components/Button/Button';
import InputPhone from '../../components/InputPhone/InputPhone';
import Textarea from '../../components/Textarea/Textarea';
import { usePartnership } from '../../utils/hooks/usePartnership/usePartnership';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Preloader from '../../components/Preloader/Preloader';
import InfoImage from '../../components/InfoImage/InfoImage';
import PopupThanks from '../../components/Popups/PopupThanks/PopupThanks';
import styles from './Partnership.module.scss';

const Partnership: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = usePartnership();
    const [showPopup, setShopPopup] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onClose = () => {
        navigate('/');
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        await mutateAsync({
            address: data.address,
            email: data.email,
            phone: data.phoneNumber,
            message: data.message,
            user_name: data.nameContact,
            restaurant_name: data.nameCompany,
        });
        setShopPopup(true);
    };

    if (showPopup) {
        return <PopupThanks title={t('pages.popupPartnershipThanks.title')} description={t('pages.popupPartnershipThanks.description')} image={<InfoImage mode="without_tube" />} />;
    }

    return (
        <Popup title={t('pages.partnership.title')} onClose={onClose}>
            {isPending && <Preloader />}
            <Form name="form-partnership" onSubmit={handleSubmit(onSubmit)}>
                <FormInputs>
                    <Input type="text" name="nameCompany" placeholder={t('pages.partnership.placeholderNameCompany')} nameLabel={t('pages.partnership.nameLabelNameCompany')} register={register} errors={errors} pattern={regexClientName}></Input>
                    <Input type="text" name="address" placeholder={t('pages.partnership.placeholderAddress')} nameLabel={t('pages.partnership.nameLabelAddress')} register={register} errors={errors} pattern={regexAddress}></Input>
                    <Input type="text" name="nameContact" placeholder={t('pages.partnership.placeholderNameContact')} nameLabel={t('pages.partnership.nameLabelNameContact')} register={register} errors={errors} pattern={regexClientName}></Input>
                    <Input type="text" name="email" placeholder={t('pages.partnership.placeholderEmail')} nameLabel={t('pages.partnership.nameLabelEmail')} register={register} errors={errors} pattern={regexEmail}></Input>
                    <InputPhone register={register} errors={errors}></InputPhone>
                    <Textarea name="message" nameLabel={t('pages.partnership.nameLabelMessage')} placeholder={t('pages.partnership.placeholderMessage')} register={register} errors={errors} pattern={regexMessage}></Textarea>
                </FormInputs>
                <Button type="submit">{t('pages.partnership.buttonSendRequest')}</Button>
            </Form>
            {error && (
                <div className={styles.error}>
                    <ErrorMessage message={error.message} />
                </div>
            )}
        </Popup>
    );
};

export default Partnership;
