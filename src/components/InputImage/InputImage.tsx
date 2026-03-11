import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import ButtonIconRound from '../ButtonIconRound/ButtonIconRound';
import styles from './InputImage.module.scss';
import { FC, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface InputImage {
    /**
     * Title for input
     */
    nameLabel: string;
    /**
     * Name of input
     */
    name: string;
    /**
     * Register function inputs
     */
    register: UseFormRegister<FieldValues>;
    /**
     * React Hook Forms error object
     */
    errors: FieldErrors;
    /**
     * Changing the input value
     */
    onChange: (image: string | null) => void;
    /**
     * Preview image value
     */
    previewImage: string | null;
}

const InputImage: FC<InputImage> = (props) => {
    const { t } = useTranslation();
    const id = useId();
    const [customError, setCustomError] = useState<string | null>(null);
    const errorMessage = customError || (props.errors[props.name]?.message as string) || undefined;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        setCustomError(null);

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setCustomError(t('components.input.errorImageFileType'));
            props.onChange(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            props.onChange(result);
        };
        reader.onerror = () => {
            setCustomError(t('components.input.errorImageFileRead'));
            props.onChange(null);
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        setCustomError(null);
        fileInputRef.current?.click();
    };

    return (
        <div className={styles.photo}>
            <label htmlFor={id}>{props.nameLabel}</label>
            <input
                {...props.register(props.name, {
                    required: t('components.input.required'),
                })}
                id={id}
                ref={fileInputRef}
                className={styles.photo__input}
                type="file"
                accept="image/*"
                onChange={handleChange}
            />

            {props.previewImage ? (
                <div className={styles.photo__image} style={{ backgroundImage: `url(${props.previewImage})` }}>
                    <div className={styles.photo__image_edit}>
                        <ButtonIconRound icon="edit" onClick={triggerFileInput} />
                    </div>
                </div>
            ) : (
                <div className={styles.photo__upload}>
                    <div className={styles.photo__upload_wrapper} onClick={triggerFileInput}>
                        <button className={styles.photo__upload_add}></button>
                    </div>
                </div>
            )}
            {errorMessage && <p className={styles.photo__error}>{errorMessage}</p>}
        </div>
    );
};

export default InputImage;
