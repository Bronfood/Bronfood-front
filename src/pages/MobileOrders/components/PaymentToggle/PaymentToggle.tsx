import styles from './PaymentToggle.module.scss';

type PaymentToggleProps = {
    isOn: boolean;
};

function PaymentToggle({ isOn }: PaymentToggleProps) {
    return (
        <div className={`${styles['toggle']} ${isOn ? styles['toggle--mode_active'] : ''}`}>
            <div className={styles['toggle__track']}>
                <div className={`${styles['toggle__thumb']} ${isOn ? styles['toggle__thumb_mode_active'] : ''}`} />
            </div>
        </div>
    );
}

export default PaymentToggle;
