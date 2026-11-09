import { useTranslation } from 'react-i18next';
import styles from './AuthMethodToggle.module.scss';

type AuthMethod = 'phone' | 'login';

type AuthMethodToggleProps = {
    /**
     * Method authentication
     */
    activeMethod: AuthMethod;
    /**
     * Change method authentication
     */
    onChange: (method: AuthMethod) => void;
};

function AuthMethodToggle({ activeMethod, onChange }: AuthMethodToggleProps) {
    const { t } = useTranslation();

    return (
        <div className={styles.toggle}>
            <button type="button" className={`${styles.toggle__button} ${activeMethod === 'phone' ? styles.toggle__button_active : ''}`} onClick={() => onChange('phone')}>
                {t('components.authMethodToggle.phone')}
            </button>
            <button type="button" className={`${styles.toggle__button} ${activeMethod === 'login' ? styles.toggle__button_active : ''}`} onClick={() => onChange('login')}>
                {t('components.authMethodToggle.login')}
            </button>
        </div>
    );
}

export default AuthMethodToggle;
