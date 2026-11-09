import { useState } from 'react';
import styles from './InputSelect.module.scss';
import { useTranslation } from 'react-i18next';

type InputSelectProps = {
    value: 'IP' | 'TOO';
    onChange: (value: 'IP' | 'TOO') => void;
    options: ('IP' | 'TOO')[];
};

function InputSelectItem({ value, onSelect, currentValue }: { value: 'IP' | 'TOO'; onSelect: (value: 'IP' | 'TOO') => void; currentValue?: string }) {
    const { t } = useTranslation();
    const isActive = value === currentValue;

    return (
        <div className={styles['option']} onClick={() => onSelect(value)}>
            <span className={`${styles['option__text']} ${isActive ? styles['option__text_active'] : ''}`}>{t(`pages.finance.${value}`)}</span>
        </div>
    );
}

function InputSelect({ options, value, onChange }: InputSelectProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => opt === value);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (value: 'IP' | 'TOO') => {
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div className={styles['input']}>
            <span className={`${styles['input__label']}`}>{t('pages.finance.nameLabelRecipientType')}</span>

            <div className={styles['input__place']}>
                <p className={styles['input__selected_text']}>{selectedOption ? t(`pages.finance.${selectedOption}`) : t(`pages.finance.${options[0]}`)}</p>
                {isOpen && (
                    <div className={styles['input__options']}>
                        {options.map((option) => (
                            <InputSelectItem key={option} value={option} onSelect={handleSelect} currentValue={value} />
                        ))}
                    </div>
                )}

                <button type="button" className={styles['input__place_button']} onClick={toggle} />
            </div>
        </div>
    );
}

export default InputSelect;
