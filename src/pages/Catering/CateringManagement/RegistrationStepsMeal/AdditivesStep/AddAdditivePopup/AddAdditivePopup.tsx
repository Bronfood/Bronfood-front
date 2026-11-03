import styles from './AddAdditivePopup.module.scss';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../../components/ButtonIconSquare/ButtonIconSquare';
import ButtonSubmit from '../../../../../../components/Button/Button';
import { Choice, Feature } from '../../../../../../utils/api/cateringMealService/cateringMealService';
import { useState } from 'react';
import InfoTooltip from '../../../../../../components/InfoTooltip/InfoTooltip';

type LocalChoice = Omit<Choice, 'price'> & { price: string };
type LocalFeature = Omit<Feature, 'choices'> & { choices: LocalChoice[] };
type VisiblePricingStrategy = 'add' | 'override';

function makeEmptyFeature(): LocalFeature {
    return {
        id: -Date.now(),
        name: '',
        selection_type: 'single',
        pricing_strategy: 'add',
        choices: [{ id: -Date.now() - 1, name: '', price: '', is_visible: true, is_default: true }],
    };
}

function featureToLocal(f: Feature): LocalFeature {
    return {
        id: f.id,
        name: f.name,
        selection_type: f.selection_type,
        pricing_strategy: f.pricing_strategy,
        choices: f.choices.map((c) => ({
            id: c.id,
            name: c.name,
            price: c.price == null ? '' : String(c.price),
            is_visible: c.is_visible,
            is_default: c.is_default,
        })),
    };
}

function AddAdditivePopup({ data, onClose, onSave }: { data: Feature | null; onClose: () => void; onSave: (feature: Feature) => void }) {
    const { t } = useTranslation();
    const [feature, setFeature] = useState<LocalFeature>(data ? featureToLocal(data) : makeEmptyFeature());
    const [error, setError] = useState<string | null>(null);
    const isPresetSize = feature.id === -1;

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setFeature((prev) => ({ ...prev, name: e.target.value }));
    };

    const handleChangeSelectionType = (value: Feature['selection_type']) => {
        setError(null);
        setFeature((prev) => ({
            ...prev,
            selection_type: value,
        }));
    };

    const handleChangePricingStrategy = (value: VisiblePricingStrategy) => {
        setError(null);
        setFeature((prev) => ({
            ...prev,
            pricing_strategy: value,
        }));
    };

    const handleChoiceChange = (index: number, field: 'name' | 'price', value: string) => {
        setError(null);
        setFeature((prev) => {
            const choices = [...prev.choices];
            choices[index] = {
                ...choices[index],
                [field]: value,
            };
            return { ...prev, choices };
        });
    };

    const handleAddChoice = () => {
        setError(null);
        setFeature((prev) => {
            const shouldBeDefault = prev.choices.length === 0;

            return {
                ...prev,
                choices: [
                    ...prev.choices,
                    {
                        id: -Date.now(),
                        name: '',
                        price: '',
                        is_visible: true,
                        is_default: shouldBeDefault,
                    },
                ],
            };
        });
    };

    const handleDeleteChoice = (index: number) => {
        setError(null);
        setFeature((prev) => {
            const wasDefault = prev.choices[index]?.is_default;
            const newChoices = prev.choices.filter((_, i) => i !== index);

            if (wasDefault && newChoices.length > 0) {
                const nextDefaultIndex = Math.min(index, newChoices.length - 1);
                newChoices[nextDefaultIndex] = {
                    ...newChoices[nextDefaultIndex],
                    is_default: true,
                };
            }

            return { ...prev, choices: newChoices };
        });
    };

    const handleChangeChoiceDefault = (index: number, checked: boolean) => {
        setError(null);
        setFeature((prev) => {
            const choices = prev.choices.map((c, i) => {
                if (prev.selection_type === 'single' && checked) {
                    return { ...c, is_default: i === index };
                }
                return i === index ? { ...c, is_default: checked } : c;
            });
            return { ...prev, choices };
        });
    };

    const handleSave = () => {
        if (!feature.name.trim()) {
            setError(t('pages.cateringManagement.fillAllFields'));
            return;
        }

        const hasEmptyChoice = feature.choices.some((c) => !c.name.trim() || c.price.trim() === '' || Number.isNaN(Number(c.price)));
        if (hasEmptyChoice) {
            setError(t('pages.cateringManagement.addAtLeastOneChoice'));
            return;
        }

        if (!isPresetSize && feature.choices.length === 0) {
            setError(t('pages.cateringManagement.addAtLeastOneChoice'));
            return;
        }

        const savedFeature: Feature = {
            ...feature,
            name: feature.name.trim(),
            choices: feature.choices.map((c) => ({
                ...c,
                name: c.name.trim(),
                price: Number(c.price),
                is_default: c.is_default,
            })),
        };

        onSave(savedFeature);
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

                            <div className={styles.group}>
                                <span className={styles.group__label}>{t('pages.cateringManagement.selectionTypeLabel')}</span>
                                <div className={styles.group__pills}>
                                    <button type="button" className={`${styles.group__pill} ${feature.selection_type === 'single' ? styles.group__pill_active : ''}`} onClick={() => handleChangeSelectionType('single')}>
                                        {t('pages.cateringManagement.single')}
                                    </button>
                                    <button type="button" className={`${styles.group__pill} ${feature.selection_type === 'multiple' ? styles.group__pill_active : ''}`} onClick={() => handleChangeSelectionType('multiple')}>
                                        {t('pages.cateringManagement.multiple')}
                                    </button>
                                    <button type="button" className={`${styles.group__pill} ${feature.selection_type === 'optional' ? styles.group__pill_active : ''}`} onClick={() => handleChangeSelectionType('optional')}>
                                        {t('pages.cateringManagement.optional')}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.group}>
                                <span className={styles.group__label}>{t('pages.cateringManagement.pricingStrategyLabel')}</span>
                                <div className={styles.group__pills}>
                                    <button type="button" className={`${styles.group__pill} ${feature.pricing_strategy === 'add' ? styles.group__pill_active : ''}`} onClick={() => handleChangePricingStrategy('add')}>
                                        {t('pages.cateringManagement.pricingStrategyAdd')}
                                    </button>
                                    <button type="button" className={`${styles.group__pill} ${feature.pricing_strategy === 'override' ? styles.group__pill_active : ''}`} onClick={() => handleChangePricingStrategy('override')}>
                                        {t('pages.cateringManagement.pricingStrategyOverride')}
                                    </button>
                                </div>
                            </div>

                            <p className={styles.popup__label}>{t('pages.cateringManagement.choices')}</p>
                            <ul className={styles.unit}>
                                {feature.choices.map((choice, index) => (
                                    <li className={styles.unit__item} key={choice.id}>
                                        <div className={styles.unit__inputs} onClick={(e) => e.stopPropagation()}>
                                            <input type="text" name={`choices.${choice.id}.name`} className={`${styles.unit__input} ${choice.is_default ? styles.unit__default : ''}`} placeholder={t('pages.cateringManagement.placeholderDefaultName')} value={choice.name} onChange={(e) => handleChoiceChange(index, 'name', e.target.value)} />
                                            <input type="number" name={`choices.${choice.id}.price`} className={`${styles.unit__input} ${choice.is_default ? styles.unit__default : ''}`} placeholder={t('pages.cateringManagement.placeholderDefaultPrice')} value={choice.price || ''} onChange={(e) => handleChoiceChange(index, 'price', e.target.value)} />
                                        </div>

                                        {choice.is_default ? (
                                            <div className={styles.unit__tooltip}>
                                                <InfoTooltip text={t('pages.cateringManagement.selectedChoiceDefaultMeal')} />
                                            </div>
                                        ) : (
                                            <div className={styles.unit__radio_empty} onClick={() => handleChangeChoiceDefault(index, true)} />
                                        )}

                                        <button type="button" className={`${styles.unit__button} ${styles.unit__button_delete}`} onClick={() => handleDeleteChoice(index)}></button>
                                    </li>
                                ))}
                            </ul>
                            {error && <p className={styles.popup__error}>{error}</p>}
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
