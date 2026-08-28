import { useTranslation } from 'react-i18next';
import styles from './ClientStep.module.scss';
import InputPhone from '../../../../components/InputPhone/InputPhone';
import { useForm } from 'react-hook-form';
import { regexClientName } from '../../../../utils/consts';
import Input from '../../../../components/Input/Input';
import { useState } from 'react';

function ClientStep() {
    const { t } = useTranslation();
    const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);

    const {
        register,
        formState: { errors },
    } = useForm();

    const handlePreOrderClick = () => {
        setIsPreOrderOpen(!isPreOrderOpen);
    };

    return (
        <div className={styles['client-step']}>
            <div className={styles['client-step__container']}>
                <p className={styles['client-step__label']}>{t('pages.admin.aboutClient')}</p>
                <div className={styles['client-step__inputs']}>
                    <InputPhone register={register} errors={errors}></InputPhone>
                    <Input type="text" name="name" placeholder={t('pages.admin.placeholderName')} nameLabel={t('pages.admin.nameLabelName')} register={register} errors={errors} pattern={regexClientName}></Input>
                </div>
            </div>
            <div className={styles['client-step__container']}>
                <p className={styles['client-step__label']}>{t('pages.admin.whenToCook')}</p>
                <div className={styles['client-step__cook-method']}>
                    <div className={styles['client-step__radio']}>
                        <input type="radio" name="now" />
                        <div className={styles['client-step__radio_text']}>
                            <p className={styles['client-step__radio_name']}>{t('pages.admin.now')}</p>
                            <p className={styles['client-step__radio_about']}>{t('pages.admin.preparingInTheNearFuture')}</p>
                        </div>
                    </div>
                    <div className={`${styles['client-step__radio']} ${styles['client-step__pre-order']}`} onClick={handlePreOrderClick}>
                        <button className={`${styles['client-step__pre-order_toggle']} ${isPreOrderOpen ? '' : styles['client-step__pre-order_hide']}`}></button>
                        <div className={styles['client-step__pre-order_component']}>
                            <input type="radio" name="pre-order" />
                            <div className={styles['client-step__radio_text']}>
                                <p className={styles['client-step__radio_name']}>{t('pages.admin.preOrder')}</p>
                                <p className={styles['client-step__radio_about']}>{t('pages.admin.chooseConvenientTimeToReceive')}</p>
                            </div>
                        </div>
                        {isPreOrderOpen && (
                            <div className={styles['client-step__pre-order_time']}>
                                <div className={styles['client-step__pre-order_radio']}>
                                    <input type="radio" name="delivery-time" />
                                    <p className={styles['client-step__pre-order_about']}>{t('pages.admin.deliveryTime')}</p>

                                    <div></div>
                                </div>
                                <div className={styles['client-step__line']}></div>
                                <div className={styles['client-step__pre-order_radio']}>
                                    <input type="radio" name="certain-time" />
                                    <p className={styles['client-step__pre-order_about']}>{t('pages.admin.forCertainTime')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles['client-step__container']}>
                <p className={styles['client-step__label']}>{t('pages.admin.methodOfGetting')}</p>
                <ul className={styles['client-step__method']}>
                    <li className={styles['client-step__method_item']}>{t('pages.admin.pickup')}</li>
                    <li className={styles['client-step__method_item']}>{t('pages.admin.delivery')}</li>
                    <li className={styles['client-step__method_item']}>{t('pages.admin.inHall')}</li>
                </ul>
            </div>
        </div>
    );
}

export default ClientStep;
