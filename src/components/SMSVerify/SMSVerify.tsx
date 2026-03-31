import { useTranslation } from 'react-i18next';
import Popup from '../Popups/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import styles from './SMSVerify.module.scss';
import Button from '../Button/Button';
import PinField from 'react-pin-field';
import { FC, useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Preloader from '../Preloader/Preloader';

interface SMSVerify {
    /**
     * Flag that determines whether to show or not to show the error
     */
    isErrorVisible: boolean;
    /**
     * Error message
     */
    error?: string;
    /**
     * Is called when the user submits the code.
     */
    onSubmit: (code: string) => void;
    /**
     * Open loading spinner
     */
    isLoading?: boolean;
    /**
     * Function invoked when popup closed
     */
    onClose?: () => void;
}

const SMSVerify: FC<SMSVerify> = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { control } = useForm();
    const [complete, setComplete] = useState<boolean>(false);
    const [values, setValues] = useState<string>('');

    const handleComplete = (value: string) => {
        const valTest = /^\d+$/;
        if (valTest.test(value)) {
            setComplete(true);
            setValues(value);
        } else {
            setComplete(false);
        }
    };

    const onSubmit = () => {
        const code = values;
        if (code.length == 4) {
            props.onSubmit(code);
        }
    };

    return (
        <Popup
            title={t('pages.confirmation.enterSmsCode')}
            onClose={() => {
                if (props.onClose) {
                    props.onClose();
                    navigate('/');
                }
            }}
        >
            <div className={styles['sms-verify__layout']}>
                {props.isLoading && <Preloader />}
                {props.isErrorVisible && <ErrorMessage message={props.error} />}
                <Form control={control} name="form-confirmation" onSubmit={onSubmit}>
                    <div className={styles['sms-verify__inputs']}>
                        <PinField length={4} className={`${styles['sms-verify__input']}`} onComplete={handleComplete} />
                    </div>
                    <Button disabled={!complete}>{t('components.button.next')}</Button>
                </Form>
            </div>
        </Popup>
    );
};
export default SMSVerify;
