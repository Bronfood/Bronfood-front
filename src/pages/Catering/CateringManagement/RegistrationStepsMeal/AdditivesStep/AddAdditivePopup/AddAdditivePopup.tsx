import styles from './AddAdditivePopup.module.scss';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../../components/ButtonIconSquare/ButtonIconSquare';
import ButtonSubmit from '../../../../../../components/Button/Button';
import { Feature } from '../../../../../../utils/api/cateringMealService/cateringMealService';
import { useState } from 'react';

function makeEmptyFeature(): Feature {
    return {
        id: -Date.now(),
        name: '',
        selection_type: 'single',
        pricing_strategy: 'add',
        choices: [{ id: -Date.now() - 1, name: '', price: 0, is_visible: true, is_default: false }],
    };
}

function featureToLocal(f: Feature): Feature {
    return {
        id: f.id,
        name: f.name,
        selection_type: f.selection_type,
        pricing_strategy: f.pricing_strategy,
        choices: f.choices.map((c) => ({
            id: c.id,
            name: c.name,
            price: c.price,
            is_visible: c.is_visible,
            is_default: c.is_default,
        })),
    };
}

function AddAdditivePopup({ data, onClose, onSave }: { data: Feature | null; onClose: () => void; onSave: (feature: Feature) => void }) {
    const { t } = useTranslation();
    const [feature, setFeature] = useState<Feature>(data ? featureToLocal(data) : makeEmptyFeature());

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFeature((prev) => ({ ...prev, name: e.target.value }));
    };

    const handleChoiceChange = (index: number, field: 'name' | 'price', value: string) => {
        setFeature((prev) => {
            const choices = [...prev.choices];
            choices[index] = {
                ...choices[index],
                [field]: field === 'price' ? Number(value) : value,
            };
            return { ...prev, choices };
        });
    };

    const handleAddChoice = () => {
        setFeature((prev) => ({
            ...prev,
            choices: [...prev.choices, { id: -Date.now(), name: '', price: 0, is_visible: true, is_default: false }],
        }));
    };

    const handleDeleteChoice = (index: number) => {
        setFeature((prev) => ({
            ...prev,
            choices: prev.choices.filter((_, i) => i !== index),
        }));
    };

    const handleSave = () => {
        onSave(feature as Feature);
    };

    return (
        <div className={styles.popup__overlay}>
            <div className={styles.popup}>
                <div className={styles.popup__content}>
                    <div onClick={onClose} className={styles.popup__close}>
                        <Button type="button" icon="close" />
                    </div>
                    <h1 className={styles.popup__title}>{t('pages.cateringManagement.specifySupplementCategoryAndTheNameTheSupplements')}</h1>
                    <div className={styles.popup__list}>
                        <div className={styles.additive}>
                            <div className={styles.input}>
                                <label htmlFor={`feature.${feature.id}.name`} className={styles.input__label}>
                                    {t('pages.cateringManagement.nameLabelAddAdditive')}
                                </label>
                                <input id={`feature.${feature.id}.name`} name={`feature.${feature.id}.name`} className={styles.input__place} type="text" placeholder={t('pages.cateringManagement.placeholderAddAdditive')} onChange={handleChangeName} value={feature.name}></input>
                            </div>
                            <ul className={styles.unit}>
                                {feature.choices.map((choice, index) => (
                                    <li className={styles.unit__item} key={choice.id}>
                                        <div className={styles.unit__inputs}>
                                            <input type="text" name={`choices.${choice.id}.name`} className={`${styles.unit__input}`} placeholder={t('pages.cateringManagement.placeholderDefaultName')} value={choice.name} onChange={(e) => handleChoiceChange(index, 'name', e.target.value)} />
                                            <input type="number" name={`choices.${choice.id}.price`} className={`${styles.unit__input}`} placeholder={t('pages.cateringManagement.placeholderDefaultPrice')} value={choice.price || ''} onChange={(e) => handleChoiceChange(index, 'price', e.target.value)} />
                                        </div>
                                        <button type="button" className={`${styles.unit__button} ${styles.unit__button_delete}`} onClick={() => handleDeleteChoice(index)}></button>
                                    </li>
                                ))}
                            </ul>
                            <button type="button" className={styles.additive__button_wrapper} onClick={handleAddChoice}>
                                <div className={styles.additive__button_add}></div>
                            </button>
                        </div>
                    </div>
                    <ButtonSubmit onClick={handleSave} type="button">
                        {t('pages.cateringManagement.save')}
                    </ButtonSubmit>
                </div>
            </div>
        </div>
    );
}

export default AddAdditivePopup;
