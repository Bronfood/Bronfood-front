import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AdminConfirmation.module.scss';
import ConfirmationPopup from '../../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import { useEsc } from '../../../utils/hooks/useEsc/useEsc';
import Preloader from '../../../components/Preloader/Preloader';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';

type AdminConfirmationProps = {
    formId?: string;
    close: () => void;
    question: string;
    onSubmit?: () => void;
    isLoading: boolean;
    isError?: boolean;
    errorMessage?: string;
};

const AdminConfirmation = ({ formId, close, question, onSubmit, isLoading, isError, errorMessage }: AdminConfirmationProps) => {
    const { t } = useTranslation();
    const handleSubmit = () => {
        if (onSubmit) onSubmit();
    };
    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };
    useEsc(() => close(), [close]);
    return (
        <div className={styles['admin-confirmation']} onClick={handleOverlayClick}>
            <ConfirmationPopup formId={formId} title={t(`pages.admin.${question}`)} confirmButtonText={t(`pages.admin.yes`)} onCancel={() => close()} onSubmit={handleSubmit} buttonDisabled={isLoading}>
                {isError && <ErrorMessage message={errorMessage} />}
            </ConfirmationPopup>
            {isLoading ? <Preloader /> : null}
        </div>
    );
};

export default AdminConfirmation;
