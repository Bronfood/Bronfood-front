import styles from './PopupThanks.module.scss';
import Popup from '../../../components/Popups/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import { FC, ReactNode } from 'react';

interface PopupThanks {
    title?: string;
    description?: string;
    image?: ReactNode;
}

const PopupThanks: FC<PopupThanks> = (props) => {
    const navigate = useNavigate();
    return (
        <Popup onClose={() => navigate('/')}>
            <div className={styles['popup-thanks']}>
                {props.image}
                <h2 className={styles['popup-thanks__title']}>{props.title}</h2>
                <p className={styles['popup-thanks__description']}>{props.description}</p>
            </div>
        </Popup>
    );
};

export default PopupThanks;
