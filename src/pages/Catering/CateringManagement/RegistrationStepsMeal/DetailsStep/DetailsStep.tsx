import { useFormContext } from 'react-hook-form';
import Textarea from '../../../../../components/Textarea/Textarea';
import styles from './DetailsStep.module.scss';
import { useTranslation } from 'react-i18next';
import { regexClientName, regexNumber } from '../../../../../utils/consts';
import InputTag from '../../../../../components/InputTag/InputTag';
import { useState } from 'react';
import Input from '../../../../../components/Input/Input';
import ButtonIconAdd from '../../../../../components/ButtonIconAdd/ButtonIconAdd';
import { MealAdditive, MealSauce, MealSize } from '../../../../../utils/api/cateringService/cateringService';

type DetailsStepProps = {
    onOpenAddAdditive: (type: 'additive' | 'sauce' | 'size') => void;
};

const DetailsStep = ({ onOpenAddAdditive }: DetailsStepProps) => {
    const { t } = useTranslation();
    const [currentTag, setCurrentTag] = useState('');

    const {
        setValue,
        register,
        formState: { errors },
        watch,
    } = useFormContext();

    const values = watch();
    const tags: { name: string }[] = watch('tags') || [];
    const mealSizes: MealSize[] = watch('mealSizes') || [];
    const mealSauces: MealSauce[] = watch('mealSauce') || [];
    const mealAdditives: MealAdditive[] = watch('mealAdditive') || [];

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

            <ul className={styles.list}>
                <li className={styles.list__item}>
                    <div className={styles.list__header}>
                        <p className={styles.list__title}>Соусы</p>
                        {mealSauces.length > 0 && <button className={styles.list__edit}></button>}
                    </div>
                    <ul className={styles.list__additive}>
                        {mealSauces.map((sauces, index) => (
                            <li className={styles.list__additive_item} key={index}>
                                <p className={styles.list__name}>{sauces.name}</p>
                                <p className={styles.list__price}>{`${sauces.price} ₸`}</p>
                            </li>
                        ))}
                    </ul>
                    {mealSauces.length === 0 && <ButtonIconAdd onClick={() => onOpenAddAdditive('sauce')}>{t('pages.cateringManagement.addSauceToMeal')}</ButtonIconAdd>}
                </li>

                <li className={styles.list__item}>
                    <p className={styles.list__title}>Добавки</p>
                    {mealAdditives.length > 0 && <button>edit</button>}
                    <ul className={styles.list__additive}>
                        {mealAdditives.map((additive, index) => (
                            <li key={index}>
                                <p>{additive.nameAdditive}</p>
                                <div>
                                    <p>{additive.nameUnit}</p>
                                    <p>{additive.price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {mealAdditives.length === 0 && <ButtonIconAdd onClick={() => onOpenAddAdditive('additive')}>{t('pages.cateringManagement.addAdditionsToMeal')}</ButtonIconAdd>}
                </li>

                <li className={styles.list__item}>
                    <p className={styles.list__title}>Размеры</p>
                    {mealSizes.length > 0 && <button>edit</button>}
                    <ul className={styles.list__additive}>
                        {mealSizes.map((sizes, index) => (
                            <li key={index}>
                                <p>{sizes.name}</p>
                                <div>
                                    <p>{sizes.size}</p>
                                    <p>{sizes.price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {mealSizes.length === 0 && <ButtonIconAdd onClick={() => onOpenAddAdditive('size')}>{t('pages.cateringManagement.addSizeToMeal')}</ButtonIconAdd>}
                </li>
            </ul>
        </fieldset>
    );
};

export default DetailsStep;
