import { useTranslation } from 'react-i18next';
import styles from './ClientStep.module.scss';
import { FieldValues, useForm } from 'react-hook-form';
import { regexAddress, regexClientName, regexPhoneNumberKazakhstan, regexTextBasic } from '../../../../utils/consts';
import { useEffect, useRef, useState } from 'react';
import Textarea from '../../../../components/Textarea/Textarea';
import Preloader from '../../../../components/Preloader/Preloader';
import ClientStepInput from './ClientStepInput/ClientStepInput';
import Fulfillments from './Fulfillments/Fulfillments';
import ClientsList from './ClientsList/ClientsList';
import { CookMethodRadio, PreOrderTypeRadioLayout } from './RadioInputs/RadioInputs';
import { CertainTimeInput, DurationInput } from './TimeInputs/TimeInputs';
import { CookMethod, PreOrderType } from '../../../../utils/api/adminService/adminService';
import { RegularClient } from '../../../../utils/api/adminClientService/adminClientService';
import { useAdminOrderContext } from '../../../../utils/hooks/useAdminOrders/useAdminOrderContext';
import { useGetClientsByPhone } from '../../../../utils/hooks/useAdminClient/useAdminClient';
import { formatPhoneForDisplay } from '../../../../utils/serviceFuncs/formatPhoneNumber';

function ClientStep() {
    const { t } = useTranslation();
    const { clientData, setClientData, cookMethod, timeData, setTimeData, setCookMethod, preOrderType, setPreOrderType, isPreOrderOpen, setIsPreOrderOpen } = useAdminOrderContext();
    const {
        register,
        formState: { errors },
        watch,
        setValue,
        clearErrors,
    } = useForm<FieldValues>({
        mode: 'onTouched',
        defaultValues: {
            fulfillment: clientData.fulfillment,
            phone: clientData.user_phone,
            name: clientData.user_name,
            street: clientData.delivery?.street,
            house: clientData.delivery?.house,
            apartment: clientData.delivery?.apartment,
            note: clientData.delivery?.note,
            deliveryDuration: clientData.delivery_duration,
            inTime: timeData.inTime,
            certainTime: timeData.certainTime,
        },
    });

    const [isClientPicked, setIsClientPicked] = useState(false);
    const [searchPhone, setSearchPhone] = useState('');

    const { data: clients, isLoading: isLoadingClient } = useGetClientsByPhone(searchPhone);

    const getMethod = clientData.fulfillment ?? 'pickup';
    const effectiveCookMethod: CookMethod = getMethod === 'dine_in' ? 'now' : cookMethod;
    const phoneBlockRef = useRef<HTMLDivElement>(null);
    const isClientRequired = getMethod !== 'dine_in';

    const handlePreOrderClick = () => {
        const nextValue = !isPreOrderOpen;
        setIsPreOrderOpen(nextValue);
        setCookMethod(nextValue ? 'preOrder' : 'now');
        clearErrors(['inTime', 'certainTime']);
    };

    const handleCookMethodClick = (method: CookMethod) => {
        setCookMethod(method);
        setIsPreOrderOpen(method === 'preOrder');
        if (method === 'now') clearErrors(['inTime', 'certainTime']);
    };

    const handlePreOrderTypeClick = (type: PreOrderType) => {
        setPreOrderType(type);
        clearErrors(type === 'inTime' ? 'certainTime' : 'inTime');
    };

    const handleClickClient = (client: RegularClient) => {
        setValue('phone', formatPhoneForDisplay(client.phone), { shouldValidate: true });
        setValue('name', client.name, { shouldValidate: true });
        setClientData((prev) => ({ ...prev, client_id: client.id }));
        setIsClientPicked(true);
        setSearchPhone('');
    };

    const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchPhone(e.target.value);
        setIsClientPicked(false);
        setClientData((prev) => ({ ...prev, client_id: undefined }));
    };

    useEffect(() => {
        const sub = watch((values, { name }) => {
            if (name === 'fulfillment' && values.fulfillment !== 'delivery') {
                clearErrors(['deliveryDuration', 'street', 'house', 'apartment', 'note']);
            }
            if (name === 'fulfillment' && values.fulfillment === 'dine_in') {
                clearErrors(['phone', 'name']);
            }
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
            setTimeData((prev) => ({ ...prev, inTime: values.inTime ?? '', certainTime: values.certainTime ?? '' }));
        });
        return () => sub.unsubscribe();
    }, [watch, setClientData, setTimeData, clearErrors]);

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
                    <p className={styles['client-step__title']}>{t('pages.admin.methodOfGetting')}</p>
                    <Fulfillments value={getMethod} name="fulfillment" register={register} />
                </div>
                <div className={styles['client-step__container']}>
                    <p className={styles['client-step__title']}>{t('pages.admin.aboutClient')}</p>
                    <div className={styles['client-step__clients-info']}>
                        <div ref={phoneBlockRef}>
                            <ClientStepInput masked type="tel" name="phone" placeholder="+7 (***)" nameLabel={t('components.inputPhone.phoneNumber')} register={register} errors={errors} pattern={regexPhoneNumberKazakhstan} required={isClientRequired} onChange={onChangePhone} />
                            {!isClientPicked && <ClientsList clients={clients?.data ?? []} onClick={handleClickClient} />}
                        </div>
                        <ClientStepInput type="text" name="name" placeholder={t('pages.admin.placeholderName')} nameLabel={t('pages.admin.nameLabelName')} register={register} errors={errors} pattern={regexClientName} required={isClientRequired} />
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
                                        <PreOrderTypeRadioLayout type="inTime" checked={preOrderType === 'inTime'} onClick={() => handlePreOrderTypeClick('inTime')} input={<DurationInput text={t('pages.admin.through')} name="inTime" unit={timeData.inTimeUnit} onUnitChange={(unit) => setTimeData((prev) => ({ ...prev, inTimeUnit: unit }))} register={register} errors={errors} required={preOrderType === 'inTime'} />} />
                                        <div className={styles['client-step__line']} />
                                        <PreOrderTypeRadioLayout type="certainTime" checked={preOrderType === 'certainTime'} onClick={() => handlePreOrderTypeClick('certainTime')} input={<CertainTimeInput name="certainTime" text={t('pages.admin.forCertainTime')} register={register} errors={errors} required={preOrderType === 'certainTime'} />} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {getMethod === 'delivery' && (
                        <div className={styles['client-step__duration']}>
                            <DurationInput unit={timeData.deliveryDurationUnit} onUnitChange={(unit) => setTimeData((prev) => ({ ...prev, deliveryDurationUnit: unit }))} text={t('pages.admin.timeForDelivery')} name="deliveryDuration" register={register} errors={errors} required={getMethod === 'delivery'} />
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
                        <Textarea name="note" placeholder={t('pages.admin.placeholderAddress')} nameLabel={t('pages.admin.nameLabelAddress')} details={t('pages.admin.nameLabelDetails')} register={register} errors={errors} pattern={regexTextBasic} />
                    </div>
                )}
            </div>
        </>
    );
}

export default ClientStep;
