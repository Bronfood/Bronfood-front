import { useTranslation } from 'react-i18next';
import styles from './ClientStep.module.scss';
import { FieldValues, useForm } from 'react-hook-form';
import { MASKPHONE, regexAddress, regexClientName, regexPhoneNumberKazakhstan, regexTextBasic, REPLACEMENT } from '../../../../utils/consts';
import { useEffect, useRef, useState } from 'react';
import Textarea from '../../../../components/Textarea/Textarea';
import { useGetClientsByPhone } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrder';
import Preloader from '../../../../components/Preloader/Preloader';
import { CookMethod, DurationUnit, PreOrderType, RegularClient } from '../../../../utils/api/adminNewOrderService/adminNewOrderService';
import { format } from '@react-input/mask';
import { useAdminNewOrderContext } from '../../../../utils/hooks/useAdminNewOrder/useAdminNewOrderContext';
import ClientStepInput from './ClientStepInput/ClientStepInput';
import Fulfillments from './Fulfillments/Fulfillments';
import ClientsList from './ClientsList/ClientsList';
import { CookMethodRadio, PreOrderTypeRadioLayout } from './RadioInputs/RadioInputs';
import { CertainTimeInput, DurationInput } from './TimeInputs/TimeInputs';

function ClientStep() {
    const { t } = useTranslation();
    const { clientData, setClientData, cookMethod, setCookMethod, preOrderType, setPreOrderType, isPreOrderOpen, setIsPreOrderOpen } = useAdminNewOrderContext();
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
            deliveryDuration: clientData.delivery_duration,
        },
    });

    const [isClientPicked, setIsClientPicked] = useState(false);
    const [searchPhone, setSearchPhone] = useState('');
    const [durationUnit, setDurationUnit] = useState<DurationUnit>('min');
    const [deliveryDurationUnit, setDeliveryDurationUnit] = useState<DurationUnit>('min');

    const { data: clients, isLoading: isLoadingClient } = useGetClientsByPhone(searchPhone);

    const formatPhone = (value: string) => (value ? format(value, { mask: MASKPHONE, replacement: REPLACEMENT }) : '');
    const getMethod = clientData.fulfillment ?? 'pickup';
    const effectiveCookMethod: CookMethod = getMethod === 'dine_in' ? 'now' : cookMethod;
    const phoneBlockRef = useRef<HTMLDivElement>(null);

    const handlePreOrderClick = () => {
        setIsPreOrderOpen((prev) => {
            const nextValue = !prev;
            setCookMethod(nextValue ? 'preOrder' : 'now');
            return nextValue;
        });
    };

    const handleCookMethodClick = (method: CookMethod) => {
        setCookMethod(method);
        if (method === 'now') {
            setIsPreOrderOpen(false);
        } else {
            setIsPreOrderOpen(true);
        }
    };

    const handlePreOrderTypeClick = (method: PreOrderType) => setPreOrderType(method);

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
                delivery_duration: values.deliveryDuration,
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

    useEffect(() => {
        console.log('clientData:', clientData);
    }, [clientData]);

    return (
        <>
            {isLoadingClient && <Preloader />}
            <div className={styles['client-step']}>
                <div className={styles['client-step__container']}>
                    <p className={styles['client-step__title']}>{t('pages.admin.methodOfGetting')}</p>
                    <Fulfillments value={getMethod} name="fulfillment" register={register} errors={errors} />
                </div>
                <div className={styles['client-step__container']}>
                    <p className={styles['client-step__title']}>{t('pages.admin.aboutClient')}</p>
                    <div className={styles['client-step__clients-info']}>
                        <div ref={phoneBlockRef}>
                            <ClientStepInput masked type="tel" name="phone" placeholder="+7 (***)" nameLabel={t('components.inputPhone.phoneNumber')} register={register} errors={errors} pattern={regexPhoneNumberKazakhstan} onChange={onChangePhone} />
                            {!isClientPicked && <ClientsList clients={clients?.data ?? []} onClick={handleClickClient} />}
                        </div>
                        <ClientStepInput type="text" name="name" placeholder={t('pages.admin.placeholderName')} nameLabel={t('pages.admin.nameLabelName')} register={register} errors={errors} pattern={regexClientName} />
                    </div>
                </div>
                <div className={styles['client-step__container']}>
                    <p className={styles['client-step__title']}>{t('pages.admin.whenToCook')}</p>
                    <div className={styles['client-step__cook-method']}>
                        <CookMethodRadio method="now" checked={effectiveCookMethod === 'now'} onClick={() => handleCookMethodClick('now')} radioNameText={t('pages.admin.now')} radioAboutText={t('pages.admin.preparingInTheNearFuture')} />
                        {getMethod !== 'dine_in' && (
                            <div className={styles['pre-order']}>
                                <button type="button" className={`${styles['pre-order__toggle']} ${isPreOrderOpen ? '' : styles['pre-order__toggle_hide']}`} onClick={handlePreOrderClick}></button>
                                <CookMethodRadio method="preOrder" checked={effectiveCookMethod === 'preOrder'} onClick={() => handleCookMethodClick('preOrder')} radioNameText={t('pages.admin.preOrder')} radioAboutText={t('pages.admin.chooseConvenientTimeToReceive')} />
                                {isPreOrderOpen && cookMethod === 'preOrder' && (
                                    <div className={styles['pre-order__time']}>
                                        <PreOrderTypeRadioLayout type="inTime" checked={preOrderType === 'inTime'} onClick={() => handlePreOrderTypeClick('inTime')} input={<DurationInput text={t('pages.admin.through')} name="inTime" unit={durationUnit} onUnitChange={setDurationUnit} register={register} errors={errors} />} />
                                        <div className={styles['client-step__line']} />
                                        <PreOrderTypeRadioLayout type="certainTime" checked={preOrderType === 'certainTime'} onClick={() => handlePreOrderTypeClick('certainTime')} input={<CertainTimeInput name="certainTime" text={t('pages.admin.forCertainTime')} register={register} errors={errors} />} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {getMethod === 'delivery' && (
                        <div className={styles['client-step__duration']}>
                            <DurationInput unit={deliveryDurationUnit} onUnitChange={setDeliveryDurationUnit} text={t('pages.admin.timeForDelivery')} name="deliveryDuration" register={register} errors={errors} />
                        </div>
                    )}
                </div>
                {getMethod === 'delivery' && (
                    <div className={styles['address']}>
                        <div>
                            <p className={styles['address__title']}>{t('pages.admin.address')}</p>
                            <p className={styles['address__info']}>{t('pages.admin.provideYourDeliveryAddress')}</p>
                        </div>
                        <div className={styles['address__inputs']}>
                            <ClientStepInput type="text" name="street" placeholder={t('pages.admin.placeholderStreet')} nameLabel={t('pages.admin.street')} register={register} errors={errors} pattern={regexAddress} />
                            <div className={styles['address__inputs_house']}>
                                <ClientStepInput type="text" name="house" placeholder={t('pages.admin.placeholderHouse')} nameLabel={t('pages.admin.house')} register={register} errors={errors} pattern={regexAddress} />
                                <ClientStepInput type="text" name="apartment" placeholder={t('pages.admin.placeholderApartment')} nameLabel={t('pages.admin.apartment')} register={register} errors={errors} pattern={regexAddress} />
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
