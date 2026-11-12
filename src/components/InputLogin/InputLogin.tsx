import { useId } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { regexLogin } from '../../utils/consts';
import styles from './InputLogin.module.scss';

interface InputLoginProps {
    /**
     * Register function inputs
     */
    register: UseFormRegister<FieldValues>;
    /**
     * React Hook Forms error object
     */
    errors: FieldErrors;
}

const InputLogin = ({ register, errors }: InputLoginProps) => {
    const { t } = useTranslation();
    const id = useId();

    const errorMessage = (errors['login']?.message as string) || undefined;

    return (
        <div className={styles.input}>
            <label htmlFor={id} className={`${styles.input__label} ${errorMessage ? styles.input__label__error : ''}`}>
                {t('components.inputLogin.login')}
            </label>
            <input
                id={id}
                className={styles.input__place}
                type="text"
                placeholder={t('components.inputLogin.loginPlaceholder')}
                {...register('login', {
                    required: t('components.input.required'),
                    pattern: {
                        value: regexLogin,
                        message: t('components.input.errorMessage'),
                    },
                })}
            />
            {errorMessage && <p className={styles.input__error}>{errorMessage}</p>}
        </div>
    );
};

export default InputLogin;
