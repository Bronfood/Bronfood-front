import { useFormContext } from 'react-hook-form';
import styles from './AddAdditivePopup.module.scss';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Button from '../../../../../../components/ButtonIconSquare/ButtonIconSquare';
import ButtonSubmit from '../../../../../../components/Button/Button';
import { Feature } from '../../../../../../utils/api/cateringMealService/cateringMealService';
import Input from '../../../../../../components/Input/Input';
import { regexClientName } from '../../../../../../utils/consts';

function AddAdditivePopup({ data, onClose }: { data?: Feature[]; onClose: () => void }) {
    const { t } = useTranslation();
    const {
        setValue,
        register,
        formState: { errors },
    } = useFormContext();

    const featureIndex = -Math.floor(Date.now() + Math.random() * 10000);
    const choiceIndex = -Math.floor(Date.now() + Math.random() * 10000);

    const [localFeatures, setLocalFeatures] = useState<Feature[]>(data && data.length > 0 ? (data as Feature[]) : [{ id: featureIndex, name: '', selection_type: 'single', pricing_strategy: 'add', choices: [{ id: choiceIndex, name: '', price: 0, is_visible: true, is_default: false }] }]);

    const handleAddMealAdditiveUnit = (choiceIndex: number) => {
        const updated = [...localFeatures];
        updated[choiceIndex].choices.push({ id: choiceIndex, name: '', price: 0, is_visible: true, is_default: false });
        setLocalFeatures(updated);
    };

    const handleDeleteChoiceUnit = (featureIndex: number, choiceIndex: number) => {
        const updated = [...localFeatures];
        updated[featureIndex].choices = updated[featureIndex].choices.filter((_, i) => i !== choiceIndex);
        setLocalFeatures(updated);
    };

    const handleSave = () => {
        setValue('features', localFeatures, { shouldValidate: true });
        onClose();
    };

    return (
        <div className={styles.popup__overlay}>
            <div className={styles.popup}>
                <div className={styles.popup__content}>
                    <div onClick={onClose} className={styles.popup__close}>
                        <Button type="button" icon="close" />
                    </div>
                    <h1 className={styles.popup__title}>{t('pages.cateringManagement.titleAddAdditivePopup')}</h1>
                    <ul className={styles.popup__list}>
                        {localFeatures.map((feature, featureIndex) => (
                            <li key={featureIndex} className={styles.additive}>
                                <Input name="name_feature" type="string" nameLabel={t('pages.cateringManagement.nameLabelAddAdditive')} placeholder={t('pages.cateringManagement.placeholderAddAdditive')} register={register} errors={errors} pattern={regexClientName} value={feature.name} />
                                <ul className={styles.unit}>
                                    {feature.choices.map((choice, choiceIndex) => (
                                        <li className={styles.unit__item} key={choiceIndex}>
                                            <div className={styles.unit__inputs}>
                                                <input
                                                    type="string"
                                                    className={`${styles.unit__input}`}
                                                    placeholder={t('pages.cateringManagement.placeholderDefaultName')}
                                                    value={choice.name}
                                                    {...register('name_choice', {
                                                        required: t('components.input.required'),
                                                    })}
                                                />
                                                <input
                                                    type="number"
                                                    className={`${styles.unit__input}`}
                                                    placeholder={t('pages.cateringManagement.placeholderDefaultPrice')}
                                                    value={choice.price}
                                                    {...register('price', {
                                                        required: t('components.input.required'),
                                                    })}
                                                />
                                            </div>
                                            <button type="button" className={`${styles.unit__button} ${styles.unit__button_delete}`} onClick={() => handleDeleteChoiceUnit(featureIndex, choiceIndex)}></button>
                                        </li>
                                    ))}
                                </ul>
                                <button type="button" className={styles.additive__button_wrapper} onClick={() => handleAddMealAdditiveUnit(featureIndex)}>
                                    <div className={styles.additive__button_add}></div>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <ButtonSubmit onClick={handleSave} type="button">
                        {t('pages.cateringManagement.buttonSave')}
                    </ButtonSubmit>
                </div>
            </div>
        </div>
    );
}

export default AddAdditivePopup;
