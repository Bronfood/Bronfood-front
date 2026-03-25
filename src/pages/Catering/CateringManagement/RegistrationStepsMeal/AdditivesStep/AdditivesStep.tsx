import styles from './AdditivesStep.module.scss';
import { useTranslation } from 'react-i18next';
import ButtonIconAdd from '../../../../../components/ButtonIconAdd/ButtonIconAdd';
import { useState } from 'react';
import AddAdditivePopup from './AddAdditivePopup/AddAdditivePopup';
import { useFormContext } from 'react-hook-form';
import { Feature } from '../../../../../utils/api/cateringMealService/cateringMealService';

const AdditivesStep = () => {
    const { t } = useTranslation();
    const [popupState, setPopupState] = useState<{ feature: Feature | null } | null>(null);
    const { watch, setValue, getValues } = useFormContext();
    const features = (watch('features') as Feature[]) ?? [];

    const handleOpenCreate = () => setPopupState({ feature: null });

    const handleOpenEdit = (feature: Feature) => setPopupState({ feature });

    const handleClosePopup = () => setPopupState(null);

    const handleSaveFeature = (savedFeature: Feature) => {
        const current = (getValues('features') as Feature[]) ?? [];
        const exists = current.some((f) => f.id === savedFeature.id);
        const updated = exists ? current.map((f) => (f.id === savedFeature.id ? savedFeature : f)) : [...current, savedFeature];
        setValue('features', updated, { shouldValidate: true });
        handleClosePopup();
    };

    return (
        <fieldset className={styles.fieldset}>
            {features ? (
                <div className={styles.list}>
                    <p className={styles.list__title}>{t('pages.cateringManagement.mealAdditives')}</p>

                    <ul className={styles.list__items}>
                        {features.map((feature) => (
                            <li className={styles.list__item} key={feature.id}>
                                <div className={styles.list__item_title}>
                                    <p className={styles.list__item_name}>{feature.name}</p>
                                    <button className={styles.list__edit} onClick={() => handleOpenEdit(feature)}></button>
                                </div>
                                <ul className={styles.list__additives}>
                                    {feature.choices.map((choice) => (
                                        <li key={choice.id} className={styles.list__additives_item}>
                                            <p className={styles.list__additives_name}>{choice.name}</p>
                                            <p className={styles.list__additives_price}>{`${choice.price} ₸`}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
            {popupState && <AddAdditivePopup data={popupState.feature} onClose={handleClosePopup} onSave={handleSaveFeature} />}
            <ButtonIconAdd onClick={handleOpenCreate}>{t('pages.cateringManagement.addAdditionsToMeal')}</ButtonIconAdd>
        </fieldset>
    );
};

export default AdditivesStep;
