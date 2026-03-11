import styles from './MediaStep.module.scss';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import InputWorkingHours from './InputWorkingHours/InputWorkingHours';
import { useFormContext } from 'react-hook-form';
import { Day, DAYS, weekdayNames } from '../../../../../utils/api/cateringService/cateringService';
import { regexTime } from '../../../../../utils/consts';
import InputImage from '../../../../../components/InputImage/InputImage';

const MediaStep = () => {
    const { t } = useTranslation();
    const {
        register,
        watch,
        formState: { errors },
        setValue,
    } = useFormContext();

    const values = watch();
    const [previewImage, setPreviewImage] = useState<string | null>(values.photo || null);
    const [isActive, setIsActive] = useState(false);
    const [isInfo, setIsInfo] = useState(false);
    const infoRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const is24h = values?.workingTime?.is24h || false;

    const formatTimeInput = (value: string): string => {
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length <= 2) return digitsOnly;
        return `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2, 4)}`;
    };

    const handleImageUpload = (image: string | null) => {
        setPreviewImage(image);
        setValue('photo', image || '', { shouldValidate: true });
    };

    const handleTimeChange = (weekday: number, field: 'open' | 'close', value: string) => {
        const formattedValue = formatTimeInput(value);
        const updatedSchedule = values.workingTime.schedule.map((day: Day) => {
            if (day.weekday === weekday) {
                return {
                    ...day,
                    [`${field}_time`]: formattedValue || null,
                };
            }
            return day;
        });
        setValue(`workingTime.schedule`, updatedSchedule, { shouldValidate: true });
    };

    const handle24hToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        const updatedSchedule = values.workingTime.schedule.map((day: Day) => ({
            ...day,
            open_time: isChecked ? '00:00' : null,
            close_time: isChecked ? '23:59' : null,
        }));

        setValue(
            'workingTime',
            {
                ...values.workingTime,
                is24h: isChecked,
                schedule: updatedSchedule,
            },
            { shouldValidate: true }
        );
    };

    const handleCancellationToggle = () => {
        setIsActive(!isActive);
    };

    const handleCancellationTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue('cancellation_time_limit', value === '' ? undefined : parseInt(value, 10), { shouldValidate: true });
    };

    const getWorkingTimeError = (open: string, close: string): string | '' => {
        const hasPatternError = (open && !regexTime.test(open)) || (close && !regexTime.test(close));
        const hasOneValue = (open && !close) || (!open && close);

        if (hasPatternError) return t('components.input.errorMessageTime');
        if (hasOneValue) return t('components.input.requiredTime');
        return '';
    };

    const handleInfoToggle = () => {
        setIsInfo(!isInfo);
    };

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (isInfo && !e.composedPath().some((e) => e === buttonRef.current || e === infoRef.current)) {
                setIsInfo(false);
            }
        };
        document.addEventListener('click', handleMouseDown);
        return () => document.removeEventListener('click', handleMouseDown);
    }, [isInfo]);

    return (
        <fieldset className={styles.fieldset}>
            <InputImage nameLabel={t('pages.cateringManagement.nameLabelPhoto')} name="photo" register={register} errors={errors} onChange={handleImageUpload} previewImage={previewImage} />
            <div className={styles.schedule}>
                <p>{t('pages.cateringManagement.nameLabelWorkingTime')}</p>

                <div className={styles.schedule__days}>
                    {DAYS.map((day) => {
                        const openFieldName = `workingTime.schedule.${day.weekday}.open_time`;
                        const closeFieldName = `workingTime.schedule.${day.weekday}.close_time`;

                        const schedule = values?.workingTime?.schedule || [];
                        const dayData = schedule[day.weekday] || day;
                        const openTime = dayData.open_time || '';
                        const closeTime = dayData.close_time || '';

                        const weekdayName = weekdayNames[day.weekday];

                        const timeError = getWorkingTimeError(openTime, closeTime);
                        return (
                            <div key={day.weekday} className={styles.day}>
                                <div className={styles.day__container}>
                                    <InputWorkingHours onChange={(value) => handleTimeChange(day.weekday, 'open', value)} placeholder={t('pages.cateringManagement.placeholderTimeOpen')} name={openFieldName} register={register} value={openTime} pairValue={closeTime} errors={timeError} />
                                    <div className={styles.day__weekday}>
                                        <label className={`${styles.day__weekday_label} ${timeError ? styles.error : ''}`}>{t(`pages.cateringManagement.${weekdayName}`)}</label>
                                        <span className={styles.day__weekday_line}></span>
                                    </div>
                                    <InputWorkingHours onChange={(value) => handleTimeChange(day.weekday, 'close', value)} placeholder={t('pages.cateringManagement.placeholderTimeClose')} name={closeFieldName} register={register} value={closeTime} pairValue={openTime} errors={timeError} />
                                </div>
                                {timeError && <p className={styles.day__error}>{timeError}</p>}
                            </div>
                        );
                    })}
                </div>

                <div className={styles.schedule__checkbox}>
                    <input id="is24h" type="checkbox" className={styles.schedule__checkbox_input} onChange={handle24hToggle} checked={is24h} />
                    <label className={styles.schedule__checkbox_label} htmlFor="is24h">
                        {t('pages.cateringManagement.nameLabelWorkingTimeTwentyFourHour')}
                    </label>
                </div>
            </div>
            <div className={styles.cancel}>
                <div className={styles.cancel__title}>
                    <p>{t('pages.cateringManagement.timeToCancelAnOrder')}</p>
                    <button className={`${styles.cancel__title_slider} ${isActive ? styles.active : ''}`} onClick={handleCancellationToggle}>
                        <span className={`${styles.cancel__title_handle} ${isActive ? styles.active : ''}`} />
                    </button>
                </div>
                {isActive && (
                    <>
                        <div className={styles.cancel__container}>
                            <div className={styles.cancel__input}>
                                <label htmlFor="cancellation_time_limit" className={`${styles.cancel__input_label} ${errors.cancellation_time_limit ? styles.cancel__input_label__error : ''}`}>
                                    {t('pages.cateringManagement.nameLabelTimeToCancel')}
                                </label>
                                <input
                                    id="cancellation_time_limit"
                                    type="text"
                                    className={styles.cancel__input_place}
                                    placeholder={t('pages.cateringManagement.placeholderTimeToCancel')}
                                    {...register('cancellation_time_limit', {
                                        required: t('components.input.required'),
                                    })}
                                    onChange={handleCancellationTimeChange}
                                    value={values.cancellation_time_limit}
                                />
                            </div>
                            <button className={styles.cancel__button} onClick={handleInfoToggle} ref={buttonRef}></button>
                            {isInfo && (
                                <div className={styles.cancel__info} ref={infoRef}>
                                    <p className={styles.cancel__text}>{t('pages.cateringManagement.infoTextTimeToCancel')}</p>
                                </div>
                            )}
                        </div>
                        {isActive && errors.cancellation_time_limit && <p className={styles.cancel__error}>{errors.cancellation_time_limit.message as string}</p>}
                    </>
                )}
            </div>
        </fieldset>
    );
};

export default MediaStep;
