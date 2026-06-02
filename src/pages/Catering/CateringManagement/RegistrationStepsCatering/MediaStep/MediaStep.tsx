import styles from './MediaStep.module.scss';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import InputWorkingHours from './InputWorkingHours/InputWorkingHours';
import { useFormContext } from 'react-hook-form';
import { Day, DAYS, weekdayNames } from '../../../../../utils/api/cateringService/cateringService';
import { CropState, regexTime } from '../../../../../utils/consts';
import InputImage from '../../../../../components/InputImage/InputImage';
import { formatCancellationTime } from '../../../../../utils/serviceFuncs/formatCancellationTime';

interface MediaStepProps {
    cropState: CropState;
    onCropStateChange: (state: CropState) => void;
}

const MediaStep = ({ cropState, onCropStateChange }: MediaStepProps) => {
    const { t } = useTranslation();
    const {
        register,
        watch,
        formState: { errors },
        setValue,
    } = useFormContext();
    const values = watch();
    const infoRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const photoValue = watch('photo');
    const type = watch('type');
    const previewImage = typeof photoValue === 'string' ? photoValue : null;
    const [isActive, setIsActive] = useState(false);
    const [isInfo, setIsInfo] = useState(false);
    const selectedWeekdays: number[] = useMemo(() => {
        if (!values.schedule) return [];
        return values.schedule.filter((day: Day) => day.open_time !== null && day.close_time !== null).map((day: Day) => day.weekday);
    }, [values.schedule]);
    const is24h = type === 'businessCenter' ? selectedWeekdays.length > 0 && selectedWeekdays.every((i) => values.schedule[i]?.open_time === '00:00' && values.schedule[i]?.close_time === '23:59') : values.schedule?.every((day: Day) => day.open_time === '00:00' && day.close_time === '23:59') || false;

    const formatTimeInput = (value: string): string => {
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length <= 2) return digitsOnly;
        return `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2, 4)}`;
    };

    const handleImageUpload = (image: string | string[] | null) => {
        const currentImage = typeof image === 'string' ? image : null;
        setValue('photo', currentImage || '', { shouldValidate: true });
    };

    const handleTimeChange = (weekday: number, field: 'open' | 'close', value: string) => {
        const formattedValue = formatTimeInput(value);
        const updatedSchedule = values.schedule.map((day: Day) => {
            if (day.weekday === weekday) {
                return {
                    ...day,
                    [`${field}_time`]: formattedValue || null,
                };
            }
            return day;
        });
        setValue(`schedule`, updatedSchedule, { shouldValidate: true });
    };

    const handleTimeChangeDelivery = (field: 'open_time' | 'close_time', value: string) => {
        const formattedValue = formatTimeInput(value);
        const updatedSchedule = values.schedule.map((day: Day) => {
            if (selectedWeekdays.includes(day.weekday)) {
                return { ...day, [field]: formattedValue || null };
            }
            return day;
        });
        setValue(`schedule`, updatedSchedule, { shouldValidate: true });
    };

    const handle24hToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;

        if (type === 'businessCenter') {
            const updatedSchedule = values.schedule.map((day: Day) => {
                if (selectedWeekdays.includes(day.weekday)) {
                    return {
                        ...day,
                        open_time: isChecked ? '00:00' : null,
                        close_time: isChecked ? '23:59' : null,
                    };
                }
                return day;
            });
            setValue('schedule', updatedSchedule, { shouldValidate: true });
        } else {
            const updatedSchedule = values.schedule.map((day: Day) => ({
                ...day,
                open_time: isChecked ? '00:00' : null,
                close_time: isChecked ? '23:59' : null,
            }));
            setValue('schedule', updatedSchedule, { shouldValidate: true });
        }
    };

    const handleCancellationToggle = () => {
        setIsActive(!isActive);
    };

    const handleCancellationTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue('cancellation_time_limit', formatCancellationTime(value), { shouldValidate: true });
    };

    const handleSelectDay = (dayId: number) => {
        const schedule = [...values.schedule];
        const dayIndex = schedule.findIndex((d: Day) => d.weekday === dayId);
        if (dayIndex === -1) return;

        const currentDay = schedule[dayIndex];
        const isSelected = currentDay.open_time !== null && currentDay.close_time !== null;

        if (isSelected) {
            schedule[dayIndex] = {
                ...currentDay,
                open_time: null,
                close_time: null,
            };
        } else {
            const referenceDay = schedule.find((d) => selectedWeekdays.includes(d.weekday) && d.open_time !== null && d.close_time !== null);
            schedule[dayIndex] = {
                ...currentDay,
                open_time: referenceDay?.open_time ?? '',
                close_time: referenceDay?.close_time ?? '',
            };
        }

        setValue('schedule', schedule, { shouldValidate: false });
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

    const render24h = () => {
        return (
            <div className={styles.schedule__checkbox}>
                <input id="is24h" type="checkbox" className={styles.schedule__checkbox_input} onChange={handle24hToggle} checked={is24h} />
                <label className={styles.schedule__checkbox_label} htmlFor="is24h">
                    {t('pages.cateringManagement.nameLabelWorkingTimeTwentyFourHour')}
                </label>
            </div>
        );
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
            <InputImage nameLabel={t('pages.cateringManagement.nameLabelPhoto')} name="photo" register={register} errors={errors} onChange={handleImageUpload} previewImages={previewImage} editing crop={{ targetWidth: 375, targetHeight: 180 }} cropState={cropState} onCropStateChange={onCropStateChange} />
            <div className={styles.schedule}>
                {type === 'businessCenter' ? (
                    <>
                        <div className={`${styles.schedule__weekday} ${styles.schedule__component}`}>
                            <p>{t('pages.cateringManagement.nameLabelWorkingTime')}</p>

                            <ul className={styles.schedule__weekday_list}>
                                {DAYS.map((day) => {
                                    const weekdayName = weekdayNames[day.weekday];
                                    const isSelected = values.schedule?.[day.weekday]?.open_time !== null && values.schedule?.[day.weekday]?.close_time !== null;
                                    return (
                                        <li key={day.weekday} className={`${styles.schedule__weekday_day} ${isSelected ? styles.schedule__weekday_selected : ''}`} onClick={() => handleSelectDay(day.weekday)}>
                                            <p className={styles.schedule__weekday_text}>{t(`pages.cateringManagement.${weekdayName}`)}</p>
                                            <input type="checkbox" style={{ display: 'none' }} name={`schedule.weekday.${weekdayName}`} checked={isSelected} readOnly />
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className={`${styles.schedule__component}`}>
                            <p>Период принятия заказа</p>
                            <div className={styles.day__container}>
                                <InputWorkingHours onChange={(value) => handleTimeChangeDelivery('open_time', value)} placeholder={t('pages.cateringManagement.placeholderTimeOpen')} name="open" register={register} value={values.schedule[selectedWeekdays[0]]?.open_time} pairValue={values.schedule[selectedWeekdays[0]]?.close_time} errors={getWorkingTimeError(values.schedule[selectedWeekdays[0]]?.open_time, values.schedule[selectedWeekdays[0]]?.close_time)} />
                                <div className={styles.day__weekday}>
                                    <span className={styles.day__weekday_line}></span>
                                </div>
                                <InputWorkingHours onChange={(value) => handleTimeChangeDelivery('close_time', value)} placeholder={t('pages.cateringManagement.placeholderTimeClose')} name="close" register={register} value={values.schedule[selectedWeekdays[0]]?.close_time} pairValue={values.schedule[selectedWeekdays[0]]?.open_time} errors={getWorkingTimeError(values.schedule[selectedWeekdays[0]]?.open_time, values.schedule[selectedWeekdays[0]]?.close_time)} />
                            </div>
                            <p className={styles.day__error}>{getWorkingTimeError(values.schedule[selectedWeekdays[0]]?.open_time, values.schedule[selectedWeekdays[0]]?.close_time)}</p>
                            {render24h()}
                        </div>
                    </>
                ) : (
                    <>
                        <p>{t('pages.cateringManagement.nameLabelWorkingTime')}</p>

                        <div className={styles.schedule__days}>
                            {DAYS.map((day) => {
                                const openFieldName = `schedule.${day.weekday}.open_time`;
                                const closeFieldName = `schedule.${day.weekday}.close_time`;

                                const schedule = values?.schedule || [];
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

                        {render24h()}
                    </>
                )}
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
