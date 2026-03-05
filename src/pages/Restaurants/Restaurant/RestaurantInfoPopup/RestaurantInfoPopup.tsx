import { MouseEvent } from 'react';
import styles from './RestaurantInfoPopup.module.scss';
import { useEsc } from '../../../../utils/hooks/useEsc/useEsc';
import { useTranslation } from 'react-i18next';

type RestaurantInfoPopupProps = {
    close: () => void;
    name: string;
    address: string;
    bin: string;
    directorFullname: string;
};

const RestaurantInfoPopup = ({ close, name, address, bin, directorFullname }: RestaurantInfoPopupProps) => {
    const { t } = useTranslation();
    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };
    useEsc(() => close(), [close]);
    return (
        <div className={styles['info-popup']} onClick={handleOverlayClick}>
            <div className={styles['popup']}>
                <h2 className={styles['popup__title']}>{t(`pages.restaurant.legalInfo`)}</h2>
                <Paragraph label={t(`pages.restaurant.legalName`)} text={name} />
                <Paragraph label={t(`pages.restaurant.legalAddress`)} text={address} />
                <Paragraph label={t(`pages.restaurant.bin`)} text={bin} />
                <Paragraph label={t(`pages.restaurant.director`)} text={directorFullname} />
                <button className={styles['popup__close']} onClick={() => close()}></button>
            </div>
        </div>
    );
};

const Paragraph = ({ label, text }: { label: string; text: string }) => {
    return (
        <div className={styles['paragraph']}>
            <span className={styles['paragraph__label']}>{label}</span>
            <p className={styles['paragraph__text']}>{text}</p>
        </div>
    );
};

export default RestaurantInfoPopup;
