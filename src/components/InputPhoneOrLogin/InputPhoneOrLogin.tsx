import { useId, useState } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { regexLogin, regexPhoneNumberKazakhstan } from '../../utils/consts';
import styles from './InputPhoneOrLogin.module.scss';
import { InputMask } from '@react-input/mask';

interface AuthInputProps {
    /**
     * Register function inputs
     */
    register: UseFormRegister<FieldValues>;
    /**
     * React Hook Forms error object
     */
    errors: FieldErrors;
    /**
     * Input name
     */
    name: string;
}

const InputPhoneOrLogin = ({ register, errors, name }: AuthInputProps) => {
    const { t } = useTranslation();
    const id = useId();
    const [mode, setMode] = useState<'phone' | 'login'>('phone');

    const errorMessage = (errors[name]?.message as string) || undefined;

    const validationRules = {
        required: t('components.input.required'),
        validate: (val: string) => {
            if (!val) return t('components.input.required');
            if (mode === 'phone') {
                return regexPhoneNumberKazakhstan.test(val) || t('components.input.errorMessage');
            }
            return regexLogin.test(val) || t('components.input.errorMessage');
        },
    };

    return (
        <div className={styles.input}>
            <div className={styles.input__buttons}>
                <button type="button" className={`${styles.input__button} ${styles.input__label} ${errorMessage ? styles.input__label_error : ''} ${mode === 'phone' ? styles.input__button_active : ''}`} onClick={() => setMode('phone')}>
                    {t('pages.signIn.phone')}
                </button>
                <button type="button" className={`${styles.input__button} ${styles.input__label} ${errorMessage ? styles.input__label_error : ''} ${mode === 'login' ? styles.input__button_active : ''}`} onClick={() => setMode('login')}>
                    {t('pages.signIn.login')}
                </button>
            </div>

            {mode === 'phone' ? <InputMask key="phone" id={id} className={styles.input__place} type="tel" placeholder={t('pages.signIn.phonePlaceholder')} {...register(name, validationRules)} mask="+7 (___) ___-__-__" replacement={{ _: /\d/ }} /> : <input key="login" id={id} className={styles.input__place} type="text" placeholder={t('pages.signIn.loginPlaceholder')} {...register(name, validationRules)} />}

            {errorMessage && <p className={styles.input__error}>{errorMessage}</p>}
        </div>
    );
};

export default InputPhoneOrLogin;
