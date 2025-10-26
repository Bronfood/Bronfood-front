import { useFormContext } from 'react-hook-form';
import Textarea from '../../../../../components/Textarea/Textarea';
import styles from './DetailsStep.module.scss';
import { useTranslation } from 'react-i18next';
import { regexClientName, regexNumber } from '../../../../../utils/consts';
import InputTag from '../../../../../components/InputTag/InputTag';
import { useState } from 'react';
import Input from '../../../../../components/Input/Input';
import { MealSize } from '../../../../../utils/api/cateringService/cateringService';

type DetailsStepProps = {
    onOpenAddAdditive: () => void;
};

const DetailsStep = ({ onOpenAddAdditive }: DetailsStepProps) => {
    const { t } = useTranslation();
    const [currentTag, setCurrentTag] = useState('');
    const [isInfo, setIsInfo] = useState(false);
    const [showMultipleMealSizes, setShowMultipleMealSizes] = useState(false);

    const {
        setValue,
        register,
        formState: { errors },
        watch,
    } = useFormContext();

    const values = watch();
    const tags: { name: string }[] = watch('tags') || [];
    const mealSizes: MealSize[] = watch('mealSizes') || [];

    const handleAddTag = (tag: string) => {
        const newTags = [...tags, { name: tag }];
        setValue('tags', newTags, { shouldValidate: true });
        setCurrentTag('');
    };

    const handleDeleteTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setValue('tags', newTags, { shouldValidate: true });
    };

    const handleTagChange = (tag: string) => {
        setCurrentTag(tag);
    };

    const handleMealSizesChangeToggle = () => {
        setShowMultipleMealSizes(!showMultipleMealSizes);
        if (showMultipleMealSizes) {
            setValue('mealSizes', []);
        }
    };

    const handleAddMealSize = () => {
        const newMealSizes = [
            ...mealSizes,
            {
                name: '',
                size: '',
                price: null,
            },
        ];
        setValue('mealSizes', newMealSizes, { shouldValidate: true });
    };

    const handleInfoToggle = () => {
        setIsInfo(!isInfo);
    };

    return (
        <fieldset className={styles.fieldset}>
            <Textarea name="description" placeholder={t('pages.cateringManagement.placeholderDescriptionMeal')} nameLabel={t('pages.cateringManagement.nameLabelDescription')} details={t('pages.cateringManagement.nameLabelDetails')} register={register} errors={errors} pattern={regexClientName} value={values.description} />
            <InputTag tags={tags} onDelete={handleDeleteTag} onAdd={handleAddTag} onChange={handleTagChange} nameLabel={t('pages.cateringManagement.nameLabelTagsMeal')} placeholder={t('pages.cateringManagement.placeholderTags')} value={currentTag} />
            <Input type="number" nameLabel={t('pages.cateringManagement.cookingTime')} placeholder={t('pages.cateringManagement.placeholderCookingTime')} register={register} errors={errors} pattern={regexNumber} name="cookingTime" />
            <div className={styles.fieldset__checkbox}>
                <input id="disposableTableware" type="checkbox" className={styles.fieldset__checkbox_input} />
                <label className={styles.fieldset__checkbox_label} htmlFor="disposableTableware">
                    {t('pages.cateringManagement.disposableTablewareUsed')}
                </label>
            </div>
            <div className={styles.fieldset__checkbox}>
                <input id="multipleMealSizes" type="checkbox" className={styles.fieldset__checkbox_input} onChange={handleMealSizesChangeToggle} />
                <label className={styles.fieldset__checkbox_label} htmlFor="multipleMealSizes">
                    {t('pages.cateringManagement.makeSeveralSizesDishes')}
                </label>
            </div>
            {showMultipleMealSizes && (
                <>
                    <ul>
                        {mealSizes.map((size, index) => (
                            <li key={index} className={styles.size}>
                                <Input type="string" nameLabel={t('pages.cateringManagement.nameLabelMealSize')} placeholder={t('pages.cateringManagement.placeholderMealSize')} register={register} errors={errors} pattern={regexClientName} name="mealSize" value={size.name} />
                                <div className={styles.size__info}>
                                    <div className={styles.sizes}>
                                        <div className={styles.sizes__list}>
                                            <input type="string" className={`${styles.sizes__input} ${index === 0 ? styles.sizes__input_first : ''}`} placeholder="100мл или гр" value={size.size} />
                                            <input type="number" className={`${styles.sizes__input} ${index === 0 ? styles.sizes__input_first : ''}`} placeholder="Цена" value={size.price} />
                                        </div>
                                        <button type="button" className={`${styles.sizes__button} ${styles.sizes__button_delete}`}></button>
                                        {index === 0 && (
                                            <>
                                                <button type="button" className={styles.sizes__button_info} onClick={handleInfoToggle}></button>
                                                {isInfo && (
                                                    <div className={styles.sizes__info}>
                                                        <p className={styles.sizes__text}>{t('pages.cateringManagement.infoTextMainMealSizes')}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className={styles.sizes__button_wrapper}>
                        <div className={styles.sizes__button_add} onClick={handleAddMealSize}></div>
                    </button>
                </>
            )}
            <button className={styles.fieldset__button} type="button" onClick={onOpenAddAdditive}>
                {t('pages.cateringManagement.additionsToMeal')}
            </button>
        </fieldset>
    );
};

export default DetailsStep;
