import { useFormContext } from 'react-hook-form';
import { MealAdditive, MealSauce, MealSize } from '../../../../../utils/api/cateringService/cateringService';
import styles from './AdditivesStep.module.scss';
import { useTranslation } from 'react-i18next';
import ButtonIconAdd from '../../../../../components/ButtonIconAdd/ButtonIconAdd';

type AdditivesStepProps = {
    onOpenAddAdditive: (type: string, data?: MealAdditive[] | MealSauce[] | MealSize[]) => void;
};

const AdditivesStep = ({ onOpenAddAdditive }: AdditivesStepProps) => {
    const { t } = useTranslation();
    const { watch } = useFormContext();

    const mealSizes: MealSize[] = watch('mealSizes') || [];
    const mealSauces: MealSauce[] = watch('mealSauces') || [];
    const mealAdditives: MealAdditive[] = watch('mealAdditives') || [];

    return (
        <fieldset className={styles.fieldset}>
            <ul className={styles.list}>
                <li className={styles.list__item}>
                    <div className={styles.list__header}>
                        <p className={styles.list__title}>{t('pages.cateringManagement.subtitleMealSauces')}</p>
                        {mealSauces.length > 0 && <button className={styles.list__edit} onClick={() => onOpenAddAdditive('sauce', mealSauces)}></button>}
                    </div>
                    {mealSauces.length === 0 ? (
                        <ButtonIconAdd onClick={() => onOpenAddAdditive('sauce', mealSauces)}>{t('pages.cateringManagement.addSauceToMeal')}</ButtonIconAdd>
                    ) : (
                        <ul className={`${styles.list__items} ${styles.list__items_sauce}`}>
                            {mealSauces.map((sauce, index) => (
                                <li className={`${styles.list__item} ${styles.list__sauce} `} key={index}>
                                    <p className={styles.list__sauce_name}>{sauce.name}</p>
                                    <p className={styles.list__sauce_price}>{`${sauce.price} ₸`}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>

                <li className={styles.list__item}>
                    <div className={styles.list__header}>
                        <p className={styles.list__title}>{t('pages.cateringManagement.subtitleMealAdditives')}</p>
                        {mealAdditives.length > 0 && <button className={styles.list__edit} onClick={() => onOpenAddAdditive('additive', mealAdditives)}></button>}
                    </div>
                    {mealAdditives.length === 0 ? (
                        <ButtonIconAdd onClick={() => onOpenAddAdditive('additive', mealAdditives)}>{t('pages.cateringManagement.addAdditionsToMeal')}</ButtonIconAdd>
                    ) : (
                        <ul className={`${styles.list__items} ${styles.list__items_additive}`}>
                            {mealAdditives.map((additive, index) => (
                                <li className={`${styles.list__item} ${styles.list__additive}`} key={index}>
                                    <p className={styles.list__additive_name}>{additive.nameAdditive}</p>
                                    <ul className={styles.list__additives}>
                                        {additive.additiveUnit.map((unit, index) => (
                                            <li key={index} className={styles.list__additives_item}>
                                                <p className={styles.list__additives_name}>{unit.name}</p>
                                                <p className={styles.list__additives_price}>{`${unit.price} ₸`}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>

                <li className={styles.list__item}>
                    <div className={styles.list__header}>
                        <p className={styles.list__title}>{t('pages.cateringManagement.subtitleMealSizes')}</p>
                        {mealSizes.length > 0 && <button className={styles.list__edit} onClick={() => onOpenAddAdditive('size', mealSizes)}></button>}
                    </div>
                    {mealSizes.length === 0 ? (
                        <ButtonIconAdd onClick={() => onOpenAddAdditive('size', mealSizes)}>{t('pages.cateringManagement.addSizeToMeal')}</ButtonIconAdd>
                    ) : (
                        <ul className={`${styles.list__items} ${styles.list__items_size}`}>
                            {mealSizes.map((size, index) => (
                                <li key={index} className={`${styles.list__item} ${styles.list__size}`}>
                                    <p className={styles.list__size_name}>{size.name}</p>
                                    <div className={styles.list__size_item}>
                                        <p className={styles.list__size_size}>{size.size}</p>
                                        <p className={styles.list__size_price}>{`${size.price} ₸`}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            </ul>
        </fieldset>
    );
};

export default AdditivesStep;
