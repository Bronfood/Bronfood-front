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
                <p>{name}</p>
                <p>{address}</p>
                <p>{bin}</p>
                <p>{directorFullname}</p>
                <button className={styles['popup__close']} onClick={() => close()}></button>
            </div>
        </div>
    );
};

export default RestaurantInfoPopup;
