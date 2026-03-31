import { FC, useState } from 'react';
import styles from './InputPhone.module.scss';
import { useId } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { regexPhoneNumberKazakhstan } from '../../utils/consts';
import { useTranslation } from 'react-i18next';
import { InputMask, format } from '@react-input/mask';

interface InputPhone {
    /**
     * Register function inputs
     */
    register: UseFormRegister<FieldValues>;
    /**
     * React Hook Forms error object
     */
    errors: FieldErrors;
    /**
     * Input Value
     */
    value?: string;
}

const InputPhone: FC<InputPhone> = (props) => {
    const [inputValue, setInputValue] = useState(props.value ? format(props.value, { mask: '+_ (___) ___-__-__', replacement: { _: /\d/ } }) : '');
    const { t } = useTranslation();
    const errorMessage = (props.errors['phoneNumber']?.message as string) || undefined;
    const id = useId();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <div className={styles.input}>
            <label htmlFor={id} className={`${styles.input__label} ${errorMessage ? styles.input__label__error : ''}`}>
                {t('components.inputPhone.phoneNumber')}
            </label>
            <InputMask
                id={id}
                className={`${styles.input__place}`}
                type="tel"
                placeholder="+7 (***)"
                {...props.register('phoneNumber', {
                    required: t('components.inputPhone.required'),
                    pattern: {
                        value: regexPhoneNumberKazakhstan,
                        message: t('components.inputPhone.invalidPhoneNumberFormat'),
                    },
                    onChange(e) {
                        handleInputChange(e);
                    },
                })}
                value={inputValue}
                mask="+_ (___) ___-__-__"
                replacement={{ _: /\d/ }}
            />
            {errorMessage && <p className={styles.input__error}>{errorMessage}</p>}
        </div>
    );
};

export default InputPhone;
