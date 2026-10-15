import { FC, useId } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InputMask } from '@react-input/mask';
import styles from './ClientStepInput.module.scss';
import { MASKPHONE, REPLACEMENT } from '../../../../../utils/consts';

interface ClientStepInput {
    type?: string;
    name: string;
    nameLabel: string;
    placeholder: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    pattern?: RegExp;
    validate?: (value: FieldValues) => string | boolean;
    masked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClientStepInput: FC<ClientStepInput> = (props) => {
    const { t } = useTranslation();
    const id = useId();
    const errorMessage = (props.errors[props.name]?.message as string) || undefined;

    const registration = props.register(props.name, {
        required: t('components.input.required'),
        pattern: props.pattern ? { value: props.pattern, message: t('components.input.errorMessage') } : undefined,
        validate: props.validate,
        onChange: props.onChange,
    });

    const commonProps = {
        id,
        className: styles.input__place,
        type: props.type ?? 'text',
        placeholder: props.placeholder,
        ...registration,
    };

    return (
        <div className={styles.input}>
            <label htmlFor={id} className={`${styles.input__label} ${errorMessage ? styles.input__label_error : ''}`}>
                {props.nameLabel}
            </label>

            {props.masked ? <InputMask {...commonProps} mask={MASKPHONE} replacement={REPLACEMENT} /> : <input {...commonProps} />}

            {errorMessage && <p className={styles.input__error}>{errorMessage}</p>}
        </div>
    );
};

export default ClientStepInput;
