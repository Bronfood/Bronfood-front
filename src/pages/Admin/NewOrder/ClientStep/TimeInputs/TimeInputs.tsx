import { FC, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TimeInputs.module.scss';
import { InputMask } from '@react-input/mask';
import { MASKTIME, regex24HourTime, regexNumber, REPLACEMENT } from '../../../../../utils/consts';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { DurationUnit } from '../../../../../utils/api/adminService/adminService';

interface DurationInputProps {
    text: string;
    name: string;
    unit: DurationUnit;
    onUnitChange: (unit: DurationUnit) => void;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

export const DurationInput: FC<DurationInputProps> = (props) => {
    const { t } = useTranslation();
    const id = useId();
    const [isOpen, setIsOpen] = useState(false);
    const errorMessage = (props.errors[props.name]?.message as string) || undefined;

    const handleToggle = () => setIsOpen((prev) => !prev);

    const handleClickType = (unit: DurationUnit) => {
        props.onUnitChange(unit);
        setIsOpen(false);
    };

    return (
        <div className={styles.input}>
            <p className={styles.input__text}>{props.text}</p>
            <div className={styles.input__time}>
                <label htmlFor={id} className={`${styles.input__label} ${errorMessage ? styles.input__label__error : ''}`} />
                <input
                    className={styles.input__place}
                    type="text"
                    {...props.register(props.name, {
                        required: t('components.input.required'),
                        pattern: {
                            value: regexNumber,
                            message: t('components.input.errorMessage'),
                        },
                    })}
                    placeholder={t('pages.admin.placeholderDuration')}
                />
                {errorMessage && <p className={styles.input__error}>{errorMessage}</p>}
                <div className={styles.input__type}>
                    <p>{t(`pages.admin.${props.unit}`)}</p>
                    <button type="button" className={`${styles.input__toggle} ${isOpen ? '' : styles.input__toggle_hide}`} onClick={handleToggle} />

                    {isOpen && (
                        <ul className={styles.input__options}>
                            <li className={`${styles.input__options_item} ${props.unit === 'min' ? styles.input__options_item_active : ''}`} onClick={() => handleClickType('min')}>
                                {t('pages.admin.min')}
                            </li>
                            <li className={`${styles.input__options_item} ${props.unit === 'hour' ? styles.input__options_item_active : ''}`} onClick={() => handleClickType('hour')}>
                                {t('pages.admin.hour')}
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

interface CertainTimeInputProps {
    text: string;
    name: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

export const CertainTimeInput: FC<CertainTimeInputProps> = (props) => {
    const { t } = useTranslation();
    return (
        <>
            <p className={styles.input__text}>{props.text}</p>
            <InputMask
                className={styles.input__place}
                type="text"
                {...props.register(props.name, {
                    required: t('components.input.required'),
                    pattern: {
                        value: regex24HourTime,
                        message: t('components.input.errorMessage'),
                    },
                })}
                mask={MASKTIME}
                replacement={REPLACEMENT}
                placeholder={t('pages.admin.placeholderCertainTime')}
            />
        </>
    );
};
