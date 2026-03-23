import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConfirmPopup.module.scss';

type ConfirmationPopupProps = {
    formId?: string;
    title: string;
    confirmButtonText: string;
    onCancel: () => void;
    onSubmit: () => void;
    buttonDisabled?: boolean;
    children?: ReactNode;
};

const ConfirmationPopup: FC<ConfirmationPopupProps> = ({ formId, title, confirmButtonText, onCancel, onSubmit, buttonDisabled, children }) => {
    const { t } = useTranslation();
    return (
        <div className={styles['confirm-popup']}>
            <h2 className={styles['confirm-popup__title']}>{title}</h2>
            {children}
            <button className={styles['confirm-popup__close']} onClick={onCancel}></button>
            <div className={styles['confirm-popup__buttonContainer']}>
                <button className={styles.cancel} onClick={onCancel} disabled={buttonDisabled}>
                    {t('components.confirmationPopup.cancel')}
                </button>
                <button className={styles.confirm} form={formId} onClick={onSubmit} disabled={buttonDisabled}>
                    {confirmButtonText}
                </button>
            </div>
        </div>
    );
};
export default ConfirmationPopup;
