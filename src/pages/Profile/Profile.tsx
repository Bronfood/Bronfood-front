import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';
import FormInputs from '../../components/FormInputs/FormInputs';
import Input from '../../components/Input/Input';
import Popup from '../../components/Popups/Popup/Popup';
import styles from './Profile.module.scss';
import { useTranslation } from 'react-i18next';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { regexClientName } from '../../utils/consts';
import InputPhone from '../../components/InputPhone/InputPhone';
import { useCurrentUser } from '../../utils/hooks/useCurrentUser/useCurretUser';
import { useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Preloader from '../../components/Preloader/Preloader';
import InputPassword from '../../components/InputPassword/InputPassword';
import SMSVerify from '../../components/SMSVerify/SMSVerify';
import { getErrorMessage } from '../../utils/serviceFuncs/getErrorMessage';

const Profile = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { updateUser, confirmUpdateUser, profile } = useCurrentUser();
    const updateUserErrorMessage = updateUser.isError ? getErrorMessage(updateUser.error, 'pages.profile.') : '';
    const confirmUpdateUserErrorMessage = confirmUpdateUser.isError ? getErrorMessage(confirmUpdateUser.error, 'pages.profile.') : '';
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { data: user, isLoading, isSuccess } = profile;

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const submitData: FieldValues = {};
        for (const inputData in data) {
            if (!data[inputData]) {
                continue;
            }
            if (inputData === 'phoneNumber') {
                submitData['phone'] = data[inputData].replace(/\D/g, '');
            } else if (inputData === 'username') {
                submitData['name'] = data[inputData];
            } else {
                submitData[inputData] = data[inputData];
            }
        }
        await updateUser.mutateAsync(submitData);
        if (`+${submitData.phone}` !== profile.data?.data.phone) {
            setIsConfirmOpen(true);
        } else navigate('/');
    };
    const validatePasswordMatch = (value: FieldValues) => {
        const { newPassword } = getValues();
        return newPassword === value || t('pages.profile.passwordDontMatch');
    };
    const confirm = async (code: string) => {
        await confirmUpdateUser.mutateAsync({ confirmation_code: code });
        setIsConfirmOpen(false);
        navigate('/');
    };

    return (
        <>
            {isConfirmOpen ? (
                <SMSVerify onClose={confirmUpdateUser.reset} isLoading={confirmUpdateUser.isPending} isErrorVisible={confirmUpdateUser.isError} error={confirmUpdateUserErrorMessage} onSubmit={confirm} />
            ) : (
                <Popup
                    title={t('pages.profile.title')}
                    onClose={() => {
                        updateUser.reset();
                        navigate('/');
                    }}
                >
                    {isLoading && <Preloader />}
                    <Form name="form-profile" onSubmit={handleSubmit(onSubmit)}>
                        {updateUser.isError && <ErrorMessage message={updateUserErrorMessage} />}
                        {isSuccess && (
                            <FormInputs>
                                <Input type="text" name="username" placeholder={t('pages.profile.placeholderUserName')} nameLabel={t('pages.profile.nameLabelUserName')} register={register} errors={errors} pattern={regexClientName} value={user.data.name}></Input>
                                <InputPhone register={register} errors={errors} value={user.data.phone}></InputPhone>
                                <InputPassword register={register} errors={errors} name="currentPassword" nameLabel={t('pages.profile.nameLabelCurrentPassword')} required={false} />
                                <InputPassword register={register} errors={errors} name="newPassword" nameLabel={t('pages.profile.nameLabelPassword')} required={false} />
                                <InputPassword register={register} errors={errors} name="newPasswordConfirm" nameLabel={t('pages.profile.nameLabelRepeatPassword')} validate={validatePasswordMatch} required={false} />
                            </FormInputs>
                        )}
                        <div className={styles['profile-button-space']}></div>
                        <Button disabled={updateUser.isPending}>{t('pages.profile.save')}</Button>
                    </Form>
                </Popup>
            )}
        </>
    );
};

export default Profile;
