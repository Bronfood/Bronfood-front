import styles from './BasketCardItem.module.scss';
import { CateringMeal } from '../../../../../utils/api/cateringMealService/cateringMealService';
import Counter from '../../../../../components/Counter/Counter';
import { useState } from 'react';

function BasketCardItem({ food, onDelete }: { food: CateringMeal; onDelete: (foodId: number) => void }) {
    const featuresLength = food.features && food.features?.length > 0;
    const [count, setCount] = useState<number>(0);
    const [selected, setSelected] = useState<Record<number, number>>({});
    const [isOpen, setIsOpen] = useState<number | null>(null);

    const handleClickOpen = (id: number) => {
        setIsOpen((prev) => (prev === id ? null : id));
    };

    const handleSelectChoice = (featureId: number, choiceId: number) => {
        setSelected((prev) => ({ ...prev, [featureId]: choiceId }));
    };

    const handleClickIncrement = () => setCount((prev) => prev + 1);
    const handleClickDecrement = () => setCount((prev) => Math.max(0, prev - 1));

    return (
        <div className={`${styles.food} ${isOpen ? styles.food__open : ''}`}>
            {featuresLength && <button className={`${styles.food__toggle} ${isOpen ? '' : styles.food__toggle_hide}`} onClick={() => handleClickOpen(food.id)}></button>}
            <div className={styles.food__info}>
                <div className={styles.food__photo} style={{ backgroundImage: `url(${food.photo})` }} />
                <div className={styles.food__management}>
                    <div className={styles.food__conteiner}>
                        <h3 className={styles.food__conteiner_text}>{food.name}</h3>
                        {food.description && <p className={styles.food__conteiner_text}>{food.description}</p>}
                    </div>
                    <div className={styles.food__counter}>
                        <Counter count={count ?? 0} increment={handleClickIncrement} decrement={handleClickDecrement} />
                        <p className={styles.food__price}>{`${food.base_price} ₸`}</p>
                        <button className={styles.food__delete} onClick={() => onDelete(food.id)}></button>
                    </div>
                </div>
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
                </>
            ) : (
                ''
            )}
        </div>
    );
}

export default BasketCardItem;
