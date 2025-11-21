import styles from './PopupPartnershipThanks.module.scss';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoImage from '../../../components/InfoImage/InfoImage';
import Popup from '../../../components/Popups/Popup/Popup';

const PopupPartnershipThanks = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <Popup onClose={() => navigate('/')}>
            <div className={styles['partnership-thanks']}>
                <InfoImage mode="without_tube" />
                <h2 className={styles['partnership-thanks__title']}>{t('pages.popupPartnershipThanks.title')}</h2>
                <p className={styles['partnership-thanks__description']}>{t('pages.popupPartnershipThanks.description')}</p>
            </div>
        </Popup>
    );
};

export default PopupPartnershipThanks;
