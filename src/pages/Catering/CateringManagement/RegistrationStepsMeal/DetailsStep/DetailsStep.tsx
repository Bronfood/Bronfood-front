import { useFormContext } from 'react-hook-form';
import Textarea from '../../../../../components/Textarea/Textarea';
import styles from './DetailsStep.module.scss';
import { useTranslation } from 'react-i18next';
import { regexTextBasic } from '../../../../../utils/consts';
import InputTag from '../../../../../components/InputTag/InputTag';
import { useState } from 'react';
import { Feature } from '../../../../../utils/api/cateringMealService/cateringMealService';
import { useParams } from 'react-router-dom';

const DetailsStep = () => {
    const { t } = useTranslation();
    const [currentTag, setCurrentTag] = useState('');
    const [error, setError] = useState<string>('');
    const {
        setValue,
        register,
        getValues,
        formState: { errors },
        watch,
    } = useFormContext();
    const values = watch();
    const tags: { name: string }[] = watch('tags') || [];
    const { cateringMealId } = useParams();
    const isEdit = Boolean(cateringMealId);

    const handleAddTag = (tag: string) => {
        if (tags.length >= 10) {
            setError(t('components.input.maximumTenTags'));
            return;
        }

        const newTags = [...tags, { name: tag }];
        setValue('tags', newTags, { shouldValidate: true });
        setCurrentTag('');
        setError('');
    };

    const handleDeleteTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setValue('tags', newTags, { shouldValidate: true });
        setError('');
    };

    const handleTagChange = (tag: string) => {
        setCurrentTag(tag);
        if (error) setError('');
    };

    const handleWaitingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setValue('waiting_time', value, { shouldValidate: true });
    };

    const handleDisposableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setValue('disposableTableware', isChecked);
        const currentFeatures = getValues('features') || [];

        const hasTableware = currentFeatures.some((f: Feature) => f.name === 'Одноразовая посуда');

        if (isChecked && !hasTableware) {
            const newFeature = {
                id: -Date.now(),
                name: 'Одноразовая посуда',
                selection_type: 'single',
                pricing_strategy: 'add',
                choices: [
                    {
                        id: -Date.now() - 1,
                        name: 'Да',
                        price: 0,
                        is_visible: true,
                        is_default: true,
                    },
                ],
            };
            setValue('features', [...currentFeatures, newFeature]);
        } else if (!isChecked && hasTableware) {
            setValue(
                'features',
                currentFeatures.filter((f: Feature) => f.name !== 'Одноразовая посуда')
            );
        }
    };

    return (
        <fieldset className={styles.fieldset}>
            <Textarea name="description" placeholder={t('pages.cateringManagement.placeholderDescriptionMeal')} nameLabel={t('pages.cateringManagement.nameLabelDescription')} details={t('pages.cateringManagement.nameLabelDetails')} register={register} errors={errors} pattern={regexTextBasic} value={values.description} />
            <InputTag tags={tags} onDelete={handleDeleteTag} onAdd={handleAddTag} onChange={handleTagChange} nameLabel={t('pages.cateringManagement.nameLabelTagsMeal')} placeholder={t('pages.cateringManagement.placeholderTags')} value={currentTag} errors={error} />

            <div className={styles.waiting__input}>
                <label htmlFor="waiting_time" className={`${styles.waiting__input_label} ${errors.waiting_time ? styles.waiting__input_label__error : ''}`}>
                    {t('pages.cateringManagement.cookingTime')}
                </label>
                <input
                    id="waiting_time"
                    type="text"
                    inputMode="numeric"
                    className={styles.waiting__input_place}
                    placeholder={t('pages.cateringManagement.placeholderCookingTime')}
                    {...register('waiting_time', {
                        required: t('components.input.required'),
                    })}
                    onChange={handleWaitingTimeChange}
                    value={values.waiting_time}
                />
                {errors.waiting_time && <p className={styles.waiting__error}>{errors.waiting_time.message as string}</p>}
            </div>

            {!isEdit && (
                <div className={styles.fieldset__checkbox}>
                    <input
                        id="disposableTableware"
                        type="checkbox"
                        className={styles.fieldset__checkbox_input}
                        {...register('disposableTableware', {
                            onChange: handleDisposableChange,
                        })}
                    />
                    <label className={styles.fieldset__checkbox_label} htmlFor="disposableTableware">
                        {t('pages.cateringManagement.disposableTablewareUsed')}
                    </label>
                </div>
            )}
        </fieldset>
    );
};

export default DetailsStep;
