import { Link, useNavigate } from 'react-router-dom';
import Popup from '../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import styles from './FeedbackPopup.module.scss';

function FeedbackPopup() {
    const navigate = useNavigate();
    const onClose = () => {
        navigate('/');
    };
    const { t } = useTranslation();

    return (
        <Popup title={t('pages.feedback.feedback')} arrowBack previousPageRoute="/" onClose={onClose}>
            <div className={styles['feedback-popup__layout']}>
                <div className={styles['feedback-popup__tel']}>+7 (702) 836 37 77</div>
                <div className={styles['feedback-popup__links']}>
                    <Link to="/about-us">{t('pages.feedback.aboutUs')}</Link>
                    <Link to="/lisence-agreement">{t('pages.feedback.lisenceAgreement')}</Link>
                </div>
            </div>
        </Popup>
    );
}

export default FeedbackPopup;
