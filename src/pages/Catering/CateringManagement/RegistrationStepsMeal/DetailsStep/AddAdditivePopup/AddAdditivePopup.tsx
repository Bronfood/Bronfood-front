import { useFormContext } from 'react-hook-form';
import Input from '../../../../../../components/Input/Input';
import { regexClientName } from '../../../../../../utils/consts';
import styles from './AddAdditivePopup.module.scss';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Button from '../../../../../../components/ButtonIconSquare/ButtonIconSquare';
import ButtonSubmit from '../../../../../../components/Button/Button';
import { MealAdditive, MealSauce, MealSize } from '../../../../../../utils/api/cateringService/cateringService';

function AddAdditivePopup({ onClose, type }: { onClose: () => void; type: 'additive' | 'sauce' | 'size' }) {
    const { t } = useTranslation();
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const mealSizes: MealSize[] = watch('mealSizes') || [];
    const mealSauces: MealSauce[] = watch('mealSauce') || [];
    const mealAdditives: MealAdditive[] = watch('mealAdditive') || [];

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

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

    const handleAddMealSauce = () => {
        const newMealSauces = [
            ...mealSauces,
            {
                name: '',
                price: null,
            },
        ];
        setValue('mealSauce', newMealSauces, { shouldValidate: true });
    };

    const handleDeleteMealSauce = (index: number) => {
        const newMealSauces = mealSauces.filter((_, i) => i !== index);
        setValue('mealSauce', newMealSauces, { shouldValidate: true });
    };

    const handleSave = () => {
        switch (type) {
            case 'sauce':
                setValue('mealSauce', mealSauces, { shouldValidate: true });
                break;
            case 'additive':
                setValue('mealAdditive', mealAdditives, { shouldValidate: true });
                break;
            case 'size':
                setValue('mealSizes', mealSizes, { shouldValidate: true });
                break;
        }
        onClose();
    };

    const titles = {
        additive: t('pages.cateringManagement.titleAddAdditivePopup'),
        sauce: t('pages.cateringManagement.titleAddSaucePopup'),
        size: t('pages.cateringManagement.titleAddSizePopup'),
    };

    const renderFormFields = () => {
        switch (type) {
            case 'sauce':
                return (
                    <>
                        <ul className={styles.popup__component}>
                            {(mealSauces.length > 0 ? mealSauces : [{ name: '', price: 0 }]).map((sauce, index) => (
                                <li key={index} className={styles.sauce}>
                                    <Input type="string" nameLabel={t('pages.cateringManagement.nameLabelName')} placeholder={t('pages.cateringManagement.placeholderMealSauce')} register={register} errors={errors} pattern={regexClientName} name={`mealSauce.${index}.name`} value={sauce.name || ''} />
                                    <div className={styles.sauce__component}>
                                        <input name="additivePrice" type="number" className={`${styles.sauce__input}`} placeholder="Цена" value={sauce.price || ''} onChange={(e) => setValue(`mealSauce.${index}.price`, Number(e.target.value))} />
                                        <button type="button" className={`${styles.sauce__button} ${styles.sauce__button_delete}`} onClick={() => handleDeleteMealSauce(index)}></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button type="button" className={styles.additive__button_wrapper} onClick={handleAddMealSauce}>
                            <div className={styles.additive__button_add}></div>
                        </button>
                    </>
                );

            case 'size':
                return (
                    <div>
                        <div className={styles.sizes}>
                            <Input type="string" nameLabel={t('pages.cateringManagement.nameLabelMealSize')} placeholder={t('pages.cateringManagement.placeholderMealSize')} register={register} errors={errors} pattern={regexClientName} name="mealSize" />
                            <div>
                                <div className={styles.sizes__list}>
                                    <input type="string" className={`${styles.sizes__input} `} placeholder="100мл или гр" />
                                    <input type="number" className={`${styles.sizes__input} `} placeholder="Цена" />
                                </div>
                                <button type="button" className={`${styles.sizes__button} ${styles.sizes__button_delete}`}></button>
                            </div>
                        </div>
                        {mealSizes.length > 0 && (
                            <ul>
                                {mealSizes.map((size, index) => (
                                    <li key={index} className={styles.size}>
                                        <Input type="string" nameLabel={t('pages.cateringManagement.nameLabelMealSize')} placeholder={t('pages.cateringManagement.placeholderMealSize')} register={register} errors={errors} pattern={regexClientName} name="mealSize" value={size.name} />
                                        <div className={styles.sizes}>
                                            <div className={styles.sizes__list}>
                                                <input type="string" className={`${styles.sizes__input} ${index === 0 ? styles.sizes__input_first : ''}`} placeholder="100мл или гр" value={size.size} />
                                                <input type="number" className={`${styles.sizes__input} ${index === 0 ? styles.sizes__input_first : ''}`} placeholder="Цена" value={size.price} />
                                            </div>
                                            <button type="button" className={`${styles.sizes__button} ${styles.sizes__button_delete}`}></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button className={styles.sizes__button_wrapper}>
                            <div className={styles.sizes__button_add} onClick={handleAddMealSize}></div>
                        </button>
                    </div>
                );

            case 'additive':
                return (
                    <div>
                        <div className={styles.additive}>
                            <Input type="string" nameLabel={t('pages.cateringManagement.nameLabelAddAdditive')} placeholder={t('pages.cateringManagement.placeholderAddAdditive')} register={register} errors={errors} pattern={regexClientName} name="addAdditive" />
                            <div>
                                <div className={styles.additive__inputs}>
                                    <input name="additiveName" type="string" className={`${styles.additive__input}`} placeholder="Название" />
                                    <input name="additivePrice" type="number" className={`${styles.additive__input}`} placeholder="Цена" />
                                </div>
                                <button type="button" className={`${styles.additive__button} ${styles.additive__button_delete}`}></button>
                            </div>
                        </div>
                        {mealAdditives.length > 0 && (
                            <ul>
                                {mealAdditives.map((additive, index) => (
                                    <li key={index}>
                                        <Input type="string" nameLabel={t('pages.cateringManagement.nameLabelAddAdditive')} placeholder={t('pages.cateringManagement.placeholderAddAdditive')} register={register} errors={errors} pattern={regexClientName} name="addAdditive" value={additive.nameAdditive} />
                                        <div className={styles.additive__inputs}>
                                            <input name="additiveName" type="string" className={`${styles.additive__input}`} placeholder="Название" value={additive.nameUnit} />
                                            <input name="additivePrice" type="number" className={`${styles.additive__input}`} placeholder="Цена" value={additive.price} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button type="button" className={styles.additive__button_wrapper}>
                            <div className={styles.additive__button_add}></div>
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className={styles.popup__overlay}>
            <div className={styles.popup}>
                <div className={styles.popup__content}>
                    <div onClick={onClose} className={styles.popup__close}>
                        <Button type="button" icon="close" />
                    </div>
                    <h1 className={styles.popup__title}>{titles[type]}</h1>

                    {renderFormFields()}

                    <ButtonSubmit onClick={handleSave} type="button">
                        {t('pages.cateringManagement.buttonSave')}
                    </ButtonSubmit>
                </div>
            </div>
        </div>
    );
}

export default AddAdditivePopup;
