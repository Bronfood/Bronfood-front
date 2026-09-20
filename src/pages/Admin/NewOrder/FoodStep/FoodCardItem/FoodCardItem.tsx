import { CateringMeal } from '../../../../../utils/api/cateringMealService/cateringMealService';
import { useTranslation } from 'react-i18next';
import styles from './FoodCardItem.module.scss';
import Button from '../../../../../components/Button/Button';
import Counter from '../../../../../components/Counter/Counter';
import { useState } from 'react';

function FoodCardItem({ food }: { food: CateringMeal }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<number | null>(null);
    const [count, setCount] = useState<number>(0);
    const [selected, setSelected] = useState<Record<number, number>>({});
    const featuresLength = food.features && food.features?.length > 0;

    const handleClickOpen = (id: number) => {
        setIsOpen((prev) => (prev === id ? null : id));
    };

    const handleSelectChoice = (featureId: number, choiceId: number) => {
        setSelected((prev) => ({ ...prev, [featureId]: choiceId }));
    };

    const handleClickIncrement = () => setCount((prev) => prev + 1);
    const handleClickDecrement = () => setCount((prev) => Math.max(0, prev - 1));

    const handleClickAdd = () => {
        handleClickIncrement();
    };

    return (
        <div className={`${styles.food} ${isOpen ? styles.food__open : ''}`}>
            <div className={styles['food__conteiner-short']}>
                <button className={styles.food__add_wrapper} onClick={handleClickAdd}>
                    <div className={styles.food__add}></div>
                </button>
                <div className={styles.food__photo} style={{ backgroundImage: `url(${food.photo})` }} />
                <div className={styles['food__conteiner-name']}>
                    <h3>{food.name}</h3>
                    {food.description && <p>{food.description}</p>}
                </div>
                {featuresLength && <button className={`${styles.food__toggle} ${isOpen ? '' : styles.food__toggle_hide}`} onClick={() => handleClickOpen(food.id)}></button>}
            </div>

            {isOpen ? (
                <>
                    {featuresLength && (
                        <ul className={styles.food__features}>
                            {food.features &&
                                food.features.map((feature) => {
                                    const normalizedName = feature?.name?.trim().toLowerCase().replace(/ё/g, 'е') || '';
                                    const isSize = normalizedName === 'размер' || normalizedName === 'объем';
                                    const isRadio = isSize || feature.selection_type === 'single';
                                    const currentChoiceId = selected[feature.id] ?? feature.choices.find((c) => c.is_default)?.id;

                                    return (
                                        <li key={feature.id} className={styles.food__feature}>
                                            <p className={styles.food__feature_name}>{feature.name}</p>
                                            <ul className={`${isSize ? styles['food__choices-size'] : styles.food__choices}`}>
                                                {feature.choices.map((choice) => (
                                                    <li key={choice.id} className={`${isSize ? styles['food__choice-size'] : styles.food__choice} ${isSize && currentChoiceId === choice.id ? styles['food__choice-size_default'] : ''}`}>
                                                        <label className={`${isSize ? styles['food__choice_label-size'] : styles.food__choice_label}`}>
                                                            <p className={`${isSize ? styles['food__choice_name-size'] : styles.food__choice_name}`}>{choice.name}</p>
                                                            <p className={`${isSize ? styles['food__choice_price-size'] : styles.food__choice_price}`}>{`${choice.price} ₸`}</p>
                                                            <input type={isRadio ? 'radio' : 'checkbox'} name={`feature-${food.id}-${feature.id}`} value={choice.id} checked={currentChoiceId === choice.id} onChange={() => handleSelectChoice(feature.id, choice.id)} />
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    );
                                })}
                        </ul>
                    )}
                    <div className={styles.food__buttons}>
                        <Counter count={count ?? 0} increment={handleClickIncrement} decrement={handleClickDecrement} />
                        <Button>{t('pages.admin.inBasket')}</Button>
                    </div>
                </>
            ) : (
                ''
            )}
        </div>
    );
}

export default FoodCardItem;
