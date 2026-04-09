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
     * Allow multiple file selection
     */
    multiple?: boolean;
    /**
     * Enable image editing functionality
     */
    editing?: boolean;
    /**
     * Enable image deletion functionality
     */
    deleting?: boolean;
    /**
     * Maximum number of files allowed
     */
    maxFiles?: number;
    /**
     * Changing the input value
     */
    onChange: (image: string | string[] | null) => void;
    /**
     * Preview image value
     */
    previewImages: string | string[] | null;
}

const InputImage: FC<InputImage> = (props) => {
    const { t } = useTranslation();
    const id = useId();
    const [customError, setCustomError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const errorMessage = customError || (props.errors[props.name]?.message as string) || undefined;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isMultiple = props.multiple === true;
    const maxFiles = props.maxFiles || 1;
    const currentImages = !props.previewImages ? [] : isMultiple ? (props.previewImages as string[]) : [props.previewImages as string];

    const updateImages = (newImages: string[]) => {
        if (isMultiple) {
            if (editingIndex !== null) {
                const updated = [...currentImages];
                updated[editingIndex] = newImages[0];
                props.onChange(updated);
            } else {
                const updated = [...currentImages, ...newImages];
                props.onChange(updated);
            }
        } else {
            props.onChange(newImages.length > 0 ? newImages[0] : null);
        }
        setEditingIndex(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            setEditingIndex(null);
            return;
        }

        setCustomError(null);

        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.startsWith('image/')) {
                setCustomError(t('components.input.selectImageFile'));
                setEditingIndex(null);
                return;
            }
        }

        const totalFiles = editingIndex !== null ? currentImages.length : currentImages.length + files.length;
        if (totalFiles > maxFiles) {
            setCustomError(t('components.input.youCanAttachMaximumImages', { max: maxFiles }));
            setEditingIndex(null);
            return;
        }

        let loadedCount = 0;
        const images: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();

            reader.onload = (event) => {
                images[i] = event.target?.result as string;
                loadedCount++;

                if (loadedCount === files.length) {
                    updateImages(images);
                }
            };

            reader.onerror = () => {
                setCustomError(t('components.input.errorUploadingFile'));
                setEditingIndex(null);
            };

            reader.readAsDataURL(files[i]);
        }
    };

    const triggerFileInput = (index?: number) => {
        setCustomError(null);
        setEditingIndex(isMultiple ? (index ?? null) : 0);
        fileInputRef.current?.click();
    };

    const removeImage = (index: number) => {
        setCustomError(null);
        if (isMultiple) {
            const updated = currentImages.filter((_, i) => i !== index);
            props.onChange(updated.length > 0 ? updated : null);
        } else {
            props.onChange(null);
        }
    };

    return (
        <div className={styles.photo}>
            <label className={styles.photo__label} htmlFor={id}>
                {props.nameLabel}
            </label>
            <input id={id} multiple={props.multiple} ref={fileInputRef} className={styles.photo__input} type="file" accept="image/*" onChange={handleChange} />

            <div className={`${styles.photo__content} ${props.multiple ? styles.photo__list : ''}`}>
                {currentImages.length > 0 && (
                    <>
                        {currentImages.map((image, index) => (
                            <div key={index} style={{ backgroundImage: `url(${image})` }} className={styles.photo__image}>
                                {props.editing && (
                                    <div className={`${styles.photo__image_edit} ${props.editing && !props.deleting ? styles.photo__image_edit_only : ''}`}>
                                        <ButtonIconRound type="button" icon="edit" onClick={() => triggerFileInput(index)} />
                                    </div>
                                )}
                                {props.deleting && (
                                    <div className={styles.photo__image_delete}>
                                        <ButtonIconRound type="button" icon="delete" onClick={() => removeImage(index)} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {currentImages.length < maxFiles && (
                    <div className={styles.photo__upload}>
                        <div className={styles.photo__upload_wrapper} onClick={() => triggerFileInput()}>
                            <button type="button" className={styles.photo__upload_add}></button>
                        </div>
                    </div>
                )}
            </div>
            {errorMessage && <p className={styles.photo__error}>{errorMessage}</p>}
        </div>
    );
};

export default InputImage;
