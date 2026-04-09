import { useId } from 'react';
import styles from './AddressInput.module.scss';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { regexAddress } from '../../../../../../utils/consts';

type AddressInputProps = {
    onChange: (address: string) => void;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    value?: string;
};

function AddressInput({ onChange, register, errors, value }: AddressInputProps) {
    const { t } = useTranslation();
    const id = useId();
    const errorMessage = (errors['address']?.message as string) || undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={styles.input}>
            <label htmlFor={id} className={`${styles.input__label} ${errorMessage ? styles.input__label__error : ''}`}>
                {t('pages.cateringManagement.nameLabelAddress')}
            </label>
            <input
                id={id}
                className={styles.input__place}
                type="text"
                placeholder={t('pages.cateringManagement.placeholderAddress')}
                {...register('address', {
                    required: t('components.input.required'),
                    pattern: {
                        value: regexAddress,
                        message: t('components.input.errorMessage'),
                    },
                })}
                onChange={handleChange}
                value={value}
            ></input>
            {errorMessage && <p className={styles.input__error}>{errorMessage}</p>}
        </div>
    );
}

export default AddressInput;
