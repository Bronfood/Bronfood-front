import { useTranslation } from 'react-i18next';
import styles from './ClientStep.module.scss';
import InputPhone from '../../../../components/InputPhone/InputPhone';
import { useForm } from 'react-hook-form';
import { regexAddress, regexClientName, regexTextBasic } from '../../../../utils/consts';
import Input from '../../../../components/Input/Input';
import { useState } from 'react';
import Textarea from '../../../../components/Textarea/Textarea';

function ClientStep() {
    const { t } = useTranslation();
    const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);
    const [getMethod, setGetMethod] = useState('pickup');
    const [cookMethod, setCookMethod] = useState('now');

    const {
        register,
        formState: { errors },
    } = useForm();

    const handlePreOrderClick = () => {
        setIsPreOrderOpen((prev) => {
            const nextValue = !prev;
            setCookMethod(nextValue ? 'preOrder' : 'now');
            return nextValue;
        });
    };

    const handleGetMethodClick = (method: string) => {
        setGetMethod(method);
        if (method === 'inHall') {
            setCookMethod('now');
            setIsPreOrderOpen(false);
        }
    };

    const handleCookMethodClick = (method: string) => {
        setCookMethod(method);
        if (method === 'now') {
            setIsPreOrderOpen(false);
        }
    };

    return (
        <div className={styles['client-step']}>
            <div className={styles['client-step__container']}>
                <p className={styles['client-step__label']}>{t('pages.admin.methodOfGetting')}</p>
                <ul className={styles['client-step__get-method']}>
                    <li className={`${styles['client-step__get-method_item']} ${getMethod === 'pickup' ? styles['client-step__get-method_active'] : ''}`}>
                        <label className={`${styles['client-step__custom-radio']} ${styles['client-step__get-method_radio']}`}>
                            <input type="radio" name="get-method" value="pickup" checked={getMethod === 'pickup'} onChange={() => handleGetMethodClick('pickup')} />
                            <p className={styles['client-step__get-method_text']}>{t('pages.admin.pickup')}</p>
                        </label>
                    </li>
                    <li className={`${styles['client-step__get-method_item']} ${getMethod === 'delivery' ? styles['client-step__get-method_active'] : ''}`}>
                        <label className={`${styles['client-step__custom-radio']} ${styles['client-step__get-method_radio']}`}>
                            <input type="radio" name="get-method" value="delivery" checked={getMethod === 'delivery'} onChange={() => handleGetMethodClick('delivery')} />
                            <p className={styles['client-step__get-method_text']}>{t('pages.admin.delivery')}</p>
                        </label>
                    </li>
                    <li className={`${styles['client-step__get-method_item']} ${getMethod === 'inHall' ? styles['client-step__get-method_active'] : ''}`}>
                        <label className={`${styles['client-step__custom-radio']} ${styles['client-step__get-method_radio']}`}>
                            <input type="radio" name="get-method" value="inHall" checked={getMethod === 'inHall'} onChange={() => handleGetMethodClick('inHall')} />
                            <p className={styles['client-step__get-method_text']}>{t('pages.admin.inHall')}</p>
                        </label>
                    </li>
                </ul>
            </div>
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
                    <label className={`${styles['client-step__label-radio']} ${styles['client-step__custom-radio']} ${styles['client-step__now']}`}>
                        <input type="radio" name="cook-method" value="now" checked={cookMethod === 'now'} onChange={() => handleCookMethodClick('now')} />
                        <div className={styles['client-step__label-radio_text']}>
                            <p className={styles['client-step__label-radio_name']}>{t('pages.admin.now')}</p>
                            <p className={styles['client-step__label-radio_about']}>{t('pages.admin.preparingInTheNearFuture')}</p>
                        </div>
                    </label>
                    {getMethod !== 'inHall' ? (
                        <label className={`${styles['client-step__label-radio']} ${styles['client-step__custom-radio']} ${styles['client-step__pre-order']}`}>
                            <button className={`${styles['client-step__pre-order_toggle']} ${isPreOrderOpen ? '' : styles['client-step__pre-order_hide']}`} onClick={handlePreOrderClick}></button>
                            <div className={styles['client-step__pre-order_component']}>
                                <input type="radio" name="cook-method" value="preOrder" checked={cookMethod === 'preOrder'} onChange={() => handleCookMethodClick('preOrder')} />
                                <div className={styles['client-step__label-radio_text']}>
                                    <p className={styles['client-step__label-radio_name']}>{t('pages.admin.preOrder')}</p>
                                    <p className={styles['client-step__label-radio_about']}>{t('pages.admin.chooseConvenientTimeToReceive')}</p>
                                </div>
                            </div>
                            {isPreOrderOpen && (
                                <div className={styles['client-step__pre-order_time']}>
                                    <label className={styles['client-step__pre-order_radio']}>
                                        <input type="radio" name="cook-method" value="deliveryTime" checked={cookMethod === 'deliveryTime'} onChange={() => handleCookMethodClick('deliveryTime')} />
                                        <p className={styles['client-step__pre-order_about']}>{t('pages.admin.through')}</p>
                                        <div className={styles['client-step__pre-order_through-time']}>
                                            <input type="text" name="through-time" value="" placeholder="45" />
                                            <select name="through-time">
                                                <option value="min">{t('pages.admin.min')}</option>
                                                <option value="hour">{t('pages.admin.hour')}</option>
                                            </select>
                                        </div>
                                    </label>

                                    <div>
                                        <div className={styles['client-step__line']}></div>
                                        <label className={styles['client-step__pre-order_radio']}>
                                            <input type="radio" name="cook-method" value="certainTime" checked={cookMethod === 'certainTime'} onChange={() => handleCookMethodClick('certainTime')} />
                                            <p className={styles['client-step__pre-order_about']}>{t('pages.admin.forCertainTime')}</p>
                                            <div className={styles['client-step__pre-order_certain-time']}>
                                                <input type="text" name="certain-time" value="" placeholder="14:30" />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </label>
                    ) : (
                        ''
                    )}
                </div>
            </div>
            {getMethod === 'delivery' && (
                <div className={styles['client-step__address']}>
                    <div>
                        <p className={styles['client-step__address_title']}>{t('pages.admin.address')}</p>
                        <p className={styles['client-step__address_info']}>{t('pages.admin.provideYourDeliveryAddress')}</p>
                    </div>
                    <div className={styles['client-step__address_inputs']}>
                        <Input type="text" name="street" placeholder={t('pages.admin.placeholderStreet')} nameLabel={t('pages.admin.street')} register={register} errors={errors} pattern={regexAddress}></Input>
                        <div className={styles['client-step__address_inputs-house']}>
                            <Input type="text" name="street" placeholder={t('pages.admin.placeholderHouse')} nameLabel={t('pages.admin.house')} register={register} errors={errors} pattern={regexAddress}></Input>
                            <Input type="text" name="street" placeholder={t('pages.admin.placeholderApartment')} nameLabel={t('pages.admin.apartment')} register={register} errors={errors} pattern={regexAddress}></Input>
                        </div>
                    </div>
                    <Textarea name="address" placeholder={t('pages.admin.placeholderAddress')} nameLabel={t('pages.admin.nameLabelAddress')} details={t('pages.admin.nameLabelDetails')} register={register} errors={errors} pattern={regexTextBasic} />
                </div>
            )}
        </div>
    );
}

export default ClientStep;
