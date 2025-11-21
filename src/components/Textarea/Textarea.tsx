import { FC, useEffect, useId, useState } from 'react';
import styles from './Textarea.module.scss';
import { useTranslation } from 'react-i18next';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface Textarea {
    /**
     * Title for textarea
     */
    nameLabel: string;
    /**
     * Placeholder for textarea
     */
    placeholder: string;
    /**
     * Name of textarea
     */
    name: string;
    /**
     * Description of textarea
     */
    details?: string;
    /**
     * Register function textareas
     */
    register: UseFormRegister<FieldValues>;
    /**
     * React Hook Forms error object
     */
    errors: FieldErrors;
    /**
     * RegExp for textarea validation
     */
    pattern: RegExp;
    /**
     * Custom validation function
     */
    validate?: (value: FieldValues) => string | boolean;
    /**
     * Textarea Value
     */
    value?: string;
}

const Textarea: FC<Textarea> = (props) => {
    const [textareaValue, setTextareaValue] = useState<string>(props.value ?? '');
    const { t } = useTranslation();
    const errorMessage = (props.errors[props.name]?.message as string) || undefined;
    const id = useId();

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaValue(e.target.value);
    };

    useEffect(() => {
        if (props.value) setTextareaValue(props.value);
    }, [props.value]);

    return (
        <div className={styles.textarea}>
            <label htmlFor={id} className={`${styles.textarea__label} ${errorMessage ? styles.textarea__label__error : ''}`}>
                <span>{props.nameLabel}</span>
                {props.details && <span className={styles.textarea__details}>{props.details}</span>}
            </label>
            <textarea
                id={id}
                className={styles.textarea__place}
                placeholder={props.placeholder}
                {...props.register(props.name, {
                    pattern: {
                        value: props.pattern,
                        message: t('components.input.errorMessage'),
                    },
                    validate: props.validate,
                })}
                onChange={handleTextareaChange}
                value={textareaValue}
            ></textarea>
            {errorMessage && <p className={styles.textarea__error}>{errorMessage}</p>}
        </div>
    );
};

export default Textarea;
