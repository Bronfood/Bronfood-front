import { ReactNode } from 'react';
import styles from './RegistrationPopup.module.scss';
import Button from '../../../../../components/ButtonIconSquare/ButtonIconSquare';

type RegistrationPopupProps = {
    title?: string;
    close: () => void;
    children?: ReactNode;
    prevStep?: () => void;
};

const RegistrationPopup = ({ title, close, children, prevStep }: RegistrationPopupProps) => {
    return (
        <div className={styles['registration-popup_overlay']}>
            <div className={styles['registration-popup']}>
                {title && <h2 className={styles['registration-popup_title']}>{title}</h2>}
                {children}
                {prevStep && (
                    <div className={`${styles['registration-popup_button']} ${styles['registration-popup_button_prev']}`}>
                        <Button type="button" onClick={prevStep} icon="back" />
                    </div>
                )}
                <div className={`${styles['registration-popup_button']} ${styles['registration-popup_button_close']}`}>
                    <Button type="button" onClick={close} icon="close" />
                </div>
            </div>
        </div>
    );
};

export default RegistrationPopup;
