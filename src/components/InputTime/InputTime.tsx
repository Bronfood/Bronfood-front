import { FC, useEffect, useState } from 'react';
import styles from './InputTime.module.scss';
import { useId } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { regex24HourTime } from '../../utils/consts';
import { useTranslation } from 'react-i18next';
import { InputMask, format } from '@react-input/mask';

interface InputTime {
    /**
     * Name of input
     */
    name: string;
    /**
     * Register function for input
     */
    register: UseFormRegister<FieldValues>;
    /**
     * React Hook Forms error object
     */
    errors: FieldErrors;
    /**
     * Placeholder for input
     */
    placeholder: string;
    /**
     * Input Value
     */
    value?: string | null;
}

export const InputTime: FC<InputTime> = (props) => {
    const [inputValue, setInputValue] = useState(props.value ? format(props.value, { mask: '__:__', replacement: { _: /\d/ } }) : '');
    const { t } = useTranslation();
    const errorMessage = (props.errors[props.name]?.message as string) || undefined;
    const id = useId();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        if (props.value) {
            setInputValue(props.value);
        } else setInputValue('');
    }, [props.value]);

    return (
        <div className={styles.input}>
            <InputMask
                id={id}
                className={`${styles.input__inner}`}
                type="text"
                placeholder={props.placeholder}
                {...props.register(props.name, {
                    pattern: {
                        value: regex24HourTime,
                        message: t('components.inputTime.invalidTimeFormat'),
                    },
                    onChange(e) {
                        handleInputChange(e);
                    },
                })}
                value={inputValue}
                mask="__:__"
                replacement={{ _: /\d/ }}
            />
            {errorMessage && <p className={styles.input__error}>{errorMessage}</p>}
        </div>
    );
};
