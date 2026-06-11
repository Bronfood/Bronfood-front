import { Link, useNavigate } from 'react-router-dom';
import Popup from '../../../components/Popups/Popup/Popup';
import { useTranslation } from 'react-i18next';
import styles from './FeedbackPopup.module.scss';

const legalLinks = [
    { label: 'Публичная оферта', href: 'landing/Bronfood_Oferta.docx' },
    { label: 'Публичная оферта для заведений-партнёров', href: 'landing/Bronfood_Oferta_Catering.docx' },
    { label: 'Согласие на сбор и обработку персональных данных', href: 'landing/Consent_To_The_Collection_And_Processing_Of_Personal_Data.pdf' },
    { label: 'Пользовательское соглашение', href: 'landing/Bronfood_User_Agreement.docx' },
    { label: 'Политика конфиденциальности', href: 'landing/Bronfood_Privacy_Policy.docx' },
    { label: 'Политика отмены заказа', href: 'landing/Cancellation_Policy.pdf' },
    { label: 'Правила возврата', href: 'landing/#refund-rules' },
];

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
                <nav className={styles['feedback-popup__links']}>
                    <Link to="/about-us">{t('pages.feedback.aboutUs')}</Link>
                    {legalLinks.map((link) => (
                        <a key={link.label} href={`${import.meta.env.VITE_API_URL}/${link.href}`}>
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        </Popup>
    );
}

export default FeedbackPopup;
