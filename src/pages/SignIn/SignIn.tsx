import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';
import FormInputs from '../../components/FormInputs/FormInputs';
import Popup from '../../components/Popups/Popup/Popup';
import styles from './SignIn.module.scss';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InputPassword from '../../components/InputPassword/InputPassword';
import InputPhone from '../../components/InputPhone/InputPhone';

import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { useCurrentUser } from '../../utils/hooks/useCurrentUser/useCurretUser';
import { useEffect, useState } from 'react';
import Preloader from '../../components/Preloader/Preloader';
import { useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../utils/serviceFuncs/getErrorMessage';
import AuthMethodToggle from '../../components/AuthMethodToggle/AuthMethodToggle';
import InputLogin from '../../components/InputLogin/InputLogin';

const SignIn = () => {
    const queryClient = useQueryClient();
    const { signIn, isLogin } = useCurrentUser();
    const signInErrorMessage = signIn.isError ? getErrorMessage(signIn.error, 'pages.signIn.') : '';
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
    } = useForm();

    const [authMethod, setAuthMethod] = useState<'phone' | 'login'>('phone');

    useEffect(() => {
        if (isLogin) {
            navigate('/');
        }
    }, [isLogin, navigate]);

    const handleMethodChange = (method: 'phone' | 'login') => {
        setAuthMethod(method);
        if (method === 'phone') {
            resetField('login');
        } else {
            resetField('phoneNumber');
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { password, phoneNumber, login } = data;
        const username = authMethod === 'phone' ? (phoneNumber || '').replace(/\D/g, '') : login;

        await signIn.mutateAsync({ username, password });
        queryClient.invalidateQueries({ queryKey: ['basket'], exact: true });
    };

    return (
        <Popup
            title={t('pages.signIn.signInHeading')}
            onClose={() => {
                signIn.reset();
                navigate('/');
            }}
        >
            {signIn.isPending && <Preloader />}
            <Form name="form-auth" onSubmit={handleSubmit(onSubmit)}>
                {signIn.isError && <ErrorMessage message={signInErrorMessage} />}
                <fieldset className={styles.form__field} disabled={signIn.isPending}>
                    <AuthMethodToggle activeMethod={authMethod} onChange={handleMethodChange} />
                    <FormInputs>
                        {authMethod === 'phone' ? <InputPhone register={register} errors={errors} /> : <InputLogin register={register} errors={errors} name="login" />}
                        <InputPassword register={register} errors={errors} name="password" nameLabel={t('pages.signIn.password')} required={true} />
                    </FormInputs>
                </fieldset>
                <Link to="/restore-password" className={`${styles['link-recovery']} link`}>
                    {t('pages.signIn.forgotPassword')}
                </Link>
                <Button disabled={signIn.isPending}>{t('pages.signIn.loginButton')}</Button>
                <Link to="/signup" className={`${styles['link-registration']} link`}>
                    {t('pages.signIn.registartion')}
                </Link>
            </Form>
        </Popup>
    );
};

export default SignIn;
