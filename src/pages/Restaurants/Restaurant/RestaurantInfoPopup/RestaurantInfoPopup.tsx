import { MouseEvent } from 'react';
import styles from './RestaurantInfoPopup.module.scss';
import { useEsc } from '../../../../utils/hooks/useEsc/useEsc';

type RestaurantInfoPopupProps = {
    close: () => void;
    name: string;
    address: string;
    bin: string;
    directorFullname: string;
};

const RestaurantInfoPopup = ({ close, name, address, bin, directorFullname }: RestaurantInfoPopupProps) => {
    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };
    useEsc(() => close(), [close]);
    return (
        <div className={styles['info-popup']} onClick={handleOverlayClick}>
            <div className={styles['popup']}>
                <h2 className={styles['popup__title']}>Юридическая информация</h2>
                <Paragraph label="Юридическое лицо" text={name} />
                <Paragraph label="Юридический адрес" text={address} />
                <Paragraph label="БИН" text={bin} />
                <Paragraph label="Руководитель" text={directorFullname} />
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
