import { MouseEvent } from 'react';
import styles from './RestaurantInfoPopup.module.scss';
import { useEsc } from '../../../../utils/hooks/useEsc/useEsc';

const RestaurantInfoPopup = ({ close }: { close: () => void }) => {
    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };
    useEsc(() => close(), [close]);
    return (
        <div className={styles['info-popup']} onClick={handleOverlayClick}>
            <div className={styles['popup']}>
                <h2 className={styles['popup__title']}>asdfasdfasdf</h2>
                <button className={styles['popup__close']} onClick={() => close()}></button>
            </div>
        </div>
    );
};

export default RestaurantInfoPopup;
