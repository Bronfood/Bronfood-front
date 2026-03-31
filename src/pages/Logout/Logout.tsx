import { FC, useEffect, MouseEvent } from 'react';
import styles from './Logout.module.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConfirmationPopup from '../../components/Popups/ConfirmationPopup/ConfirmationPopup';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Preloader from '../../components/Preloader/Preloader';
import { useCurrentUser } from '../../utils/hooks/useCurrentUser/useCurretUser';
import { useEsc } from '../../utils/hooks/useEsc/useEsc';
import { useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../utils/serviceFuncs/getErrorMessage';

const Logout: FC = () => {
    const queryClient = useQueryClient();
    const { isLogin, logout } = useCurrentUser();
    const logoutErrorMessage = logout.isError ? getErrorMessage(logout.error, 'pages.logout.') : '';
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleLogout = () => {
        try {
            logout.mutate();
        } finally {
            logout.reset();
            queryClient.setQueryData(['basket'], () => {
                return {
                    data: {
                        restaurant: {},
                        meals: [],
                    },
                };
            });
        }
    };
    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            navigate('/');
        }
    };
    const onClose = () => {
        logout.reset();
        navigate('/');
    };
    useEffect(() => {
        if (!isLogin) {
            navigate('/');
        }
    }, [isLogin, navigate]);
    useEsc(() => {
        onClose();
    }, []);

    return (
        <div className={styles.logout} onClick={handleOverlayClick}>
            <ConfirmationPopup title={t(`pages.logout.areYouSure`)} confirmButtonText={t(`pages.logout.signout`)} onCancel={onClose} onSubmit={handleLogout}>
                {logout.isPending && <Preloader />}
                {logout.isError && <ErrorMessage message={logoutErrorMessage} />}
            </ConfirmationPopup>
        </div>
    );
};

export default Logout;
