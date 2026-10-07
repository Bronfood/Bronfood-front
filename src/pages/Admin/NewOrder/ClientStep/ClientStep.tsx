import { useTranslation } from 'react-i18next';
import styles from './ClientStep.module.scss';
import { FieldValues, useForm } from 'react-hook-form';
import { MASK, regexAddress, regexClientName, regexPhoneNumberKazakhstan, regexTextBasic, REPLACEMENT } from '../../../../utils/consts';
import Input from '../../../../components/Input/Input';
import { useEffect, useRef, useState } from 'react';
import Textarea from '../../../../components/Textarea/Textarea';
import { useGetClientsByPhone } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrder';
import Preloader from '../../../../components/Preloader/Preloader';
import { CookMethod, Fulfillment, RegularClient } from '../../../../utils/api/adminNewOrderService/adminNewOrderService';
import { InputMask, format } from '@react-input/mask';
import { useAdminNewOrderContext } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrderContext';

function ClientStep() {
    const { t } = useTranslation();
    const { clientData, setClientData, cookMethod, setCookMethod } = useAdminNewOrderContext();
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useForm<FieldValues>({
        defaultValues: {
            fulfillment: clientData.fulfillment,
            phone: clientData.user_phone,
            name: clientData.user_name,
            street: clientData.delivery?.street,
            house: clientData.delivery?.house,
            apartment: clientData.delivery?.apartment,
            note: clientData.delivery?.note,
        },
    });

    const phoneBlockRef = useRef<HTMLDivElement>(null);
    const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);
    const [isClientPicked, setIsClientPicked] = useState(false);
    const [getMethod, setGetMethod] = useState<Fulfillment>(clientData.fulfillment ?? 'pickup');
    const [searchPhone, setSearchPhone] = useState('');
    const { data: clients, isLoading: isLoadingClient } = useGetClientsByPhone(searchPhone);

    const formatPhone = (value: string) => (value ? format(value, { mask: MASK, replacement: REPLACEMENT }) : '');

    const handlePreOrderClick = () => {
        setIsPreOrderOpen((prev) => {
            const nextValue = !prev;
            setCookMethod(nextValue ? 'preOrder' : 'now');
            return nextValue;
        });
    };

    const handleGetMethodClick = (method: Fulfillment) => {
        setGetMethod(method);
        setClientData((prev) => ({ ...prev, fulfillment: method }));
        if (method === 'dine_in') {
            setCookMethod('now');
            setIsPreOrderOpen(false);
        }
    };

    const handleCookMethodClick = (method: CookMethod) => {
        setCookMethod(method);
        if (method === 'now') {
            setIsPreOrderOpen(false);
        }
    };

    const handleClickClient = (client: RegularClient) => {
        setValue('phone', formatPhone(client.phone));
        setValue('name', client.name, { shouldValidate: true });
        setClientData((prev) => ({ ...prev, client_id: client.id }));
        setIsClientPicked(true);
        setSearchPhone('');
    };

    const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchPhone(value);
        setIsClientPicked(false);
    };

    useEffect(() => {
        const sub = watch((values) => {
            setClientData((prev) => ({
                ...prev,
                fulfillment: values.fulfillment,
                user_phone: values.phone,
                user_name: values.name,
                delivery: {
                    ...prev.delivery,
                    street: values.street,
                    house: values.house,
                    apartment: values.apartment,
                    note: values.note,
                },
            }));
        });
        return () => sub.unsubscribe();
    }, [watch, setClientData]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (phoneBlockRef.current && !phoneBlockRef.current.contains(e.target as Node)) {
                setIsClientPicked(true);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {isLoadingClient && <Preloader />}
            <div className={styles['client-step']}>
                <div className={styles['client-step__container']}>
                    <p className={styles['client-step__label']}>{t('pages.admin.methodOfGetting')}</p>
                    <ul className={styles['client-step__fulfillment']}>
                        <li className={`${styles['client-step__fulfillment_item']} ${getMethod === 'pickup' ? styles['client-step__fulfillment_active'] : ''}`}>
                            <label className={`${styles['client-step__fulfillment_label']} ${styles['client-step__custom-radio']} ${styles['client-step__fulfillment_radio']}`}>
                                <input type="radio" name="fulfillment" value="pickup" checked={getMethod === 'pickup'} onChange={() => handleGetMethodClick('pickup')} />
                                <p className={styles['client-step__fulfillment_text']}>{t('pages.admin.pickup')}</p>
                            </label>
                        </li>
                        <li className={`${styles['client-step__fulfillment_item']} ${getMethod === 'delivery' ? styles['client-step__fulfillment_active'] : ''}`}>
                            <label className={`${styles['client-step__custom-radio']} ${styles['client-step__fulfillment_radio']}`}>
                                <input type="radio" name="fulfillment" value="delivery" checked={getMethod === 'delivery'} onChange={() => handleGetMethodClick('delivery')} />
                                <p className={styles['client-step__fulfillment_text']}>{t('pages.admin.delivery')}</p>
                            </label>
                        </li>
                        <li className={`${styles['client-step__fulfillment_item']} ${getMethod === 'dine_in' ? styles['client-step__fulfillment_active'] : ''}`}>
                            <label className={`${styles['client-step__custom-radio']} ${styles['client-step__fulfillment_radio']}`}>
                                <input type="radio" name="fulfillment" value="dine_in" checked={getMethod === 'dine_in'} onChange={() => handleGetMethodClick('dine_in')} />
                                <p className={styles['client-step__fulfillment_text']}>{t('pages.admin.inHall')}</p>
                            </label>
                        </li>
                    </ul>
                </div>
                <div className={styles['client-step__container']}>
                    <p className={styles['client-step__label']}>{t('pages.admin.aboutClient')}</p>
                    <div className={styles['client-step__inputs']}>
                        <div className={styles['client-step__input-phone']} ref={phoneBlockRef}>
                            <label className={styles['client-step__input-phone_label']}>{t('components.inputPhone.phoneNumber')}</label>
                            <InputMask
                                className={`${styles['client-step__input-phone_place']}`}
                                type="tel"
                                mask={MASK}
                                replacement={REPLACEMENT}
                                placeholder="+7 (***)"
                                {...register('phone', {
                                    pattern: {
                                        value: regexPhoneNumberKazakhstan,
                                        message: t('components.inputPhone.invalidPhoneNumberFormat'),
                                    },
                                    onChange(e) {
                                        onChangePhone(e);
                                    },
                                })}
                            />
                            {!isClientPicked && clients?.data && clients.data.length > 0 && (
                                <ul className={`${styles['clients']} ${clients.data.length > 4 ? styles['clients__scroll'] : ''}`}>
                                    {clients.data.map((client) => (
                                        <li key={client.id} className={styles['clients__item']} onClick={() => handleClickClient(client)}>
                                            <p className={styles['clients__phone']}>{client.phone}</p>
                                            <p className={styles['clients__name']}>{client.name}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Input type="text" name="name" placeholder={t('pages.admin.placeholderName')} nameLabel={t('pages.admin.nameLabelName')} register={register} errors={errors} pattern={regexClientName} value={clientData.user_name ?? ''}></Input>
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
                        {getMethod !== 'dine_in' ? (
                            <label className={`${styles['client-step__label-radio']} ${styles['client-step__custom-radio']} ${styles['client-step__pre-order']}`}>
                                <button type="button" className={`${styles['client-step__pre-order_toggle']} ${isPreOrderOpen ? '' : styles['client-step__pre-order_hide']}`} onClick={handlePreOrderClick}></button>
                                <div className={styles['client-step__pre-order_component']}>
                                    <input type="radio" name="cook-method" value="preOrder" checked={cookMethod === 'preOrder'} onChange={() => handleCookMethodClick('preOrder')} />
                                    <div className={styles['client-step__label-radio_text']}>
                                        <p className={styles['client-step__label-radio_name']}>{t('pages.admin.preOrder')}</p>
                                        <p className={styles['client-step__label-radio_about']}>{t('pages.admin.chooseConvenientTimeToReceive')}</p>
                                    </div>
                                </div>
                                {isPreOrderOpen && (
                                    <>
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
                                                {getMethod !== 'delivery' && <div className={styles['client-step__line']}></div>}
                                                <label className={styles['client-step__pre-order_radio']}>
                                                    <input type="radio" name="cook-method" value="certainTime" checked={cookMethod === 'certainTime'} onChange={() => handleCookMethodClick('certainTime')} />
                                                    <p className={styles['client-step__pre-order_about']}>{t('pages.admin.forCertainTime')}</p>
                                                    <div className={styles['client-step__pre-order_certain-time']}>
                                                        <input type="text" name="certain-time" value="" placeholder="14:30" />
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {getMethod === 'delivery' && (
                                            <>
                                                <div className={styles['client-step__line-delivery']}></div>
                                                <label className={styles['client-step__pre-order_time-for-delivery']}>
                                                    <div className={styles['client-step__pre-order_radio']}></div>
                                                    <p className={styles['client-step__pre-order_about']}>{t('pages.admin.timeForDelivery')}</p>
                                                    <div className={styles['client-step__pre-order_through-time']}>
                                                        <input type="text" name="through-time" value="" placeholder="45" />
                                                        <select name="through-time">
                                                            <option value="min">{t('pages.admin.min')}</option>
                                                            <option value="hour">{t('pages.admin.hour')}</option>
                                                        </select>
                                                    </div>
                                                </label>
                                            </>
                                        )}
                                    </>
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
                            <Input type="text" name="street" placeholder={t('pages.admin.placeholderStreet')} nameLabel={t('pages.admin.street')} register={register} errors={errors} pattern={regexAddress} value={clientData.delivery?.street ?? ''}></Input>
                            <div className={styles['client-step__address_inputs-house']}>
                                <Input type="text" name="house" placeholder={t('pages.admin.placeholderHouse')} nameLabel={t('pages.admin.house')} register={register} errors={errors} pattern={regexAddress} value={clientData.delivery?.house ?? ''}></Input>
                                <Input type="text" name="apartment" placeholder={t('pages.admin.placeholderApartment')} nameLabel={t('pages.admin.apartment')} register={register} errors={errors} pattern={regexAddress} value={clientData.delivery?.apartment ?? ''}></Input>
                            </div>
                        </div>
                        <Textarea name="note" placeholder={t('pages.admin.placeholderAddress')} nameLabel={t('pages.admin.nameLabelAddress')} details={t('pages.admin.nameLabelDetails')} register={register} errors={errors} pattern={regexTextBasic} value={clientData.delivery?.note ?? ''} />
                    </div>
                )}
            </div>
        </>
    );
}

export default ClientStep;
