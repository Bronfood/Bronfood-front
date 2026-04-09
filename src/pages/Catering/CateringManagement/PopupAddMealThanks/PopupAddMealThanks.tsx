import styles from './PopupAddMealThanks.module.scss';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Popup from '../../../../components/Popups/Popup/Popup';
import InfoImage from '../../../../components/InfoImage/InfoImage';

const PopupAddMealThanks = ({ onNavigate }: { onNavigate: () => void }) => {
    const { t } = useTranslation();

    useEffect(() => {
        setTimeout(() => {
            onNavigate();
        }, 3000);
    }, [onNavigate]);

    return (
        <Popup onClose={onNavigate}>
            <div className={styles['thanks']}>
                <InfoImage mode="default_screen" />
                <h2 className={styles['title']}>{t('pages.cateringManagement.yourMenuSaved')}</h2>
            </div>
        </Popup>
    );
};

export default PopupAddMealThanks;
