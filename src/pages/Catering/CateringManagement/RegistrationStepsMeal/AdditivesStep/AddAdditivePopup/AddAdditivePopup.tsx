import { useFormContext } from 'react-hook-form';
import styles from './AddAdditivePopup.module.scss';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Button from '../../../../../../components/ButtonIconSquare/ButtonIconSquare';
import ButtonSubmit from '../../../../../../components/Button/Button';
import { MealAdditive, MealSauce, MealSize } from '../../../../../../utils/api/cateringService/cateringService';
import LocalInput from './LocalInput/LocalInput';
import ButtonIconAdd from '../../../../../../components/ButtonIconAdd/ButtonIconAdd';

function AddAdditivePopup({ onClose, type }: { onClose: () => void; type: 'additive' | 'sauce' | 'size' }) {
    const { t } = useTranslation();
    const { setValue } = useFormContext();

    const [localSauces, setLocalSauces] = useState<MealSauce[]>([{ name: '', price: 0 }]);
    const [localAdditives, setLocalAdditives] = useState<MealAdditive[]>([{ nameAdditive: '', additiveUnit: [{ name: '', price: 0 }] }]);
    const [localSizes, setLocalSizes] = useState<MealSize[]>([{ name: '', size: '', price: 0 }]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleAddMealSauce = () => {
        setLocalSauces((prev) => [...prev, { name: '', price: 0 }]);
    };

    const handleAddMealAdditive = () => {
        setLocalAdditives((prev) => [...prev, { nameAdditive: '', additiveUnit: [{ name: '', price: 0 }] }]);
    };

    const handleAddMealAdditiveUnit = (additiveIndex: number) => {
        const updated = [...localAdditives];
        updated[additiveIndex].additiveUnit.push({ name: '', price: 0 });
        setLocalAdditives(updated);
    };

    const handleAddMealSize = () => {
        setLocalSizes((prev) => [...prev, { name: '', size: '', price: 0 }]);
    };

    const handleDeleteMealSauce = (index: number) => {
        setLocalSauces(localSauces.filter((_, i) => i !== index));
    };

    const handleDeleteMealSize = (index: number) => {
        setLocalSizes(localSizes.filter((_, i) => i !== index));
    };

    const handleDeleteMealAdditiveUnit = (additiveIndex: number, unitIndex: number) => {
        const updated = [...localAdditives];
        updated[additiveIndex].additiveUnit = updated[additiveIndex].additiveUnit.filter((_, i) => i !== unitIndex);
        setLocalAdditives(updated);
    };

    const onChangePrice = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedSauces = [...localSauces];
        updatedSauces[index] = {
            ...updatedSauces[index],
            price: Number(e.target.value),
        };
        setLocalSauces(updatedSauces);
    };

    const onChangeMealSizePrice = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedSizes = [...localSizes];
        updatedSizes[index] = {
            ...updatedSizes[index],
            price: Number(e.target.value),
        };
        setLocalSizes(updatedSizes);
    };

    const onChangeAdditivePrice = (additiveIndex: number, unitIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = [...localAdditives];
        updated[additiveIndex].additiveUnit[unitIndex] = {
            ...updated[additiveIndex].additiveUnit[unitIndex],
            price: Number(e.target.value),
        };
        setLocalAdditives(updated);
    };

    const onChangeMealSizeSize = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedSizes = [...localSizes];
        updatedSizes[index] = {
            ...updatedSizes[index],
            size: e.target.value,
        };
        setLocalSizes(updatedSizes);
    };

    const onChangeSauceName = (index: number, value: string) => {
        const updatedSauces = [...localSauces];
        updatedSauces[index] = { ...updatedSauces[index], name: value };
        setLocalSauces(updatedSauces);
    };

    const onChangeAdditiveName = (index: number, value: string) => {
        const updatedAdditives = [...localAdditives];
        updatedAdditives[index] = { ...updatedAdditives[index], nameAdditive: value };
        setLocalAdditives(updatedAdditives);
    };

    const onChangeAdditiveNameUnit = (additiveIndex: number, unitIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = [...localAdditives];
        updated[additiveIndex].additiveUnit[unitIndex] = {
            ...updated[additiveIndex].additiveUnit[unitIndex],
            name: e.target.value,
        };
        setLocalAdditives(updated);
    };

    const onChangeMealSizeName = (index: number, value: string) => {
        const updatedSizes = [...localSizes];
        updatedSizes[index] = { ...updatedSizes[index], name: value };
        setLocalSizes(updatedSizes);
    };

    const handleSave = () => {
        const nonEmptySauces = localSauces.filter((sauce) => sauce.name.trim() !== '' && sauce.price !== 0);

        switch (type) {
            case 'sauce':
                setValue('mealSauces', nonEmptySauces, { shouldValidate: true });
                break;
            case 'additive':
                setValue('mealAdditives', localAdditives, { shouldValidate: true });
                break;
            case 'size':
                setValue('mealSizes', localSizes, { shouldValidate: true });
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
                        <ul className={styles.popup__list}>
                            {localSauces.map((sauce, index) => (
                                <li key={index} className={styles.sauce}>
                                    <LocalInput type="text" nameLabel={t('pages.cateringManagement.nameLabelName')} placeholder={t('pages.cateringManagement.placeholderMealSauce')} name={`sauceName-${index}`} value={sauce.name} onChange={(value) => onChangeSauceName(index, value)} />
                                    <div className={styles.sauce__component}>
                                        <input name={`saucePrice-${index}`} type="number" className={`${styles.sauce__input}`} placeholder="Цена" value={sauce.price || ''} onChange={(e) => onChangePrice(index, e)} />
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

            case 'additive':
                return (
                    <>
                        <ul className={styles.popup__list}>
                            {localAdditives.map((additive, additiveIndex) => (
                                <li key={additiveIndex} className={styles.additive}>
                                    <LocalInput type="string" nameLabel={t('pages.cateringManagement.nameLabelAddAdditive')} placeholder={t('pages.cateringManagement.placeholderAddAdditive')} value={additive.nameAdditive} name={`additiveName-${additiveIndex}`} onChange={(value) => onChangeAdditiveName(additiveIndex, value)} />
                                    {additive.additiveUnit.map((unit, unitIndex) => (
                                        <ul className={styles.unit}>
                                            <li className={styles.unit__item} key={unitIndex}>
                                                <div className={styles.unit__inputs}>
                                                    <input name={`additiveNameUnit-${unitIndex}`} type="string" className={`${styles.unit__input}`} placeholder="Название" value={unit.name || ''} onChange={(e) => onChangeAdditiveNameUnit(additiveIndex, unitIndex, e)} />
                                                    <input name={`additivePrice-${unitIndex}`} type="number" className={`${styles.unit__input}`} placeholder="Цена" value={unit.price || ''} onChange={(e) => onChangeAdditivePrice(additiveIndex, unitIndex, e)} />
                                                </div>
                                                <button type="button" className={`${styles.unit__button} ${styles.unit__button_delete}`} onClick={() => handleDeleteMealAdditiveUnit(additiveIndex, unitIndex)}></button>
                                            </li>
                                        </ul>
                                    ))}

                                    <button type="button" className={styles.additive__button_wrapper} onClick={() => handleAddMealAdditiveUnit(additiveIndex)}>
                                        <div className={styles.additive__button_add}></div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <ButtonIconAdd onClick={handleAddMealAdditive}>{t('pages.cateringManagement.addAdditionsToMealPopup')}</ButtonIconAdd>
                    </>
                );

            case 'size':
                return (
                    <>
                        <ul className={styles.popup__list}>
                            {localSizes.map((size, index) => (
                                <li key={index} className={styles.size}>
                                    <LocalInput type="string" nameLabel={t('pages.cateringManagement.nameLabelMealSize')} placeholder={t('pages.cateringManagement.placeholderMealSize')} name={`mealSizeName-${index}`} value={size.name || ''} onChange={(value) => onChangeMealSizeName(index, value)} />
                                    <div className={styles.size__component}>
                                        <div className={styles.size__imputs}>
                                            <input name={`mealSizeSize-${index}`} type="string" className={`${styles.size__input} ${index === 0 ? styles.size__input_first : ''}`} placeholder="100мл или гр" value={size.size || ''} onChange={(e) => onChangeMealSizeSize(index, e)} />
                                            <input name={`mealSizePrice-${index}`} type="number" className={`${styles.size__input} ${index === 0 ? styles.size__input_first : ''}`} placeholder="Цена" value={size.price || ''} onChange={(e) => onChangeMealSizePrice(index, e)} />
                                        </div>
                                        <button type="button" className={`${styles.size__button} ${styles.size__button_delete}`} onClick={() => handleDeleteMealSize(index)}></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button type="button" className={styles.additive__button_wrapper} onClick={handleAddMealSize}>
                            <div className={styles.additive__button_add}></div>
                        </button>
                    </>
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
