import { useTranslation } from 'react-i18next';
import { Feature } from '../../../utils/api/restaurantsService/restaurantsService';
import styles from './AdminMealCard.module.scss';
import { AdminMeal } from '../../../utils/api/adminNewOrderService/adminNewOrderService';
import { ReactNode, useState } from 'react';
import Button from '../../Button/Button';
import Counter from '../../Counter/Counter';
import Preloader from '../../Preloader/Preloader';
import { useGetAdminFeatures } from '../../../utils/hooks/useAdminNewOrder/useAdminNewOrder';

function Features({ features, selected, onSelectChoice }: { features: Feature[]; selected: Record<number, number>; onSelectChoice: (featureId: number, choiceId: number) => void }) {
    if (features.length === 0) return null;

    return (
        <ul className={styles.features}>
            {features.map((feature) => {
                const normalizedName = feature?.name?.trim().toLowerCase().replace(/ё/g, 'е') || '';
                const isSize = normalizedName.includes('размер') || normalizedName.includes('объем');
                const currentChoiceId = selected[feature.id] ?? feature.choices[0]?.id;

                return (
                    <li key={feature.id} className={styles.features__item}>
                        <p className={styles.features__item_name}>{feature.name}</p>
                        <ul className={`${isSize ? styles['choices-size'] : styles.choices}`}>
                            {feature.choices.map((choice) => (
                                <li key={choice.id} className={`${isSize ? styles['choices__item-size'] : styles.choices__item} ${isSize && currentChoiceId === choice.id ? styles['choices__item-size_default'] : ''}`}>
                                    <label className={`${isSize ? styles['choices__item_label-size'] : styles.choices__item_label}`}>
                                        <p className={`${isSize ? styles['choices__item_name-size'] : styles.choices__item_name}`}>{choice.name}</p>
                                        <p className={`${isSize ? styles['choices__item_price-size'] : styles.choices__item_price}`}>{`${choice.price} ₸`}</p>
                                        <input type="radio" name={`feature-${feature.id}`} value={choice.id} checked={currentChoiceId === choice.id} onChange={() => onSelectChoice(feature.id, choice.id)} />
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </li>
                );
            })}
        </ul>
    );
}

function Details({ meal, restaurantId, onAddCount, isBascket }: { meal: AdminMeal; restaurantId: number; onAddCount?: (mealId: number, count: number) => void; isBascket?: boolean }) {
    const { t } = useTranslation();
    const { data: featuresData, isLoading } = useGetAdminFeatures(restaurantId, meal.id);
    const features = featuresData?.data ?? [];

    const [selected, setSelected] = useState<Record<number, number>>({});
    const [count, setCount] = useState<number>(1);

    const handleSelectChoice = (featureId: number, choiceId: number) => {
        setSelected((prev) => ({ ...prev, [featureId]: choiceId }));
    };
    const handleClickIncrement = () => setCount((prev) => prev + 1);
    const handleClickDecrement = () => setCount((prev) => Math.max(0, prev - 1));
    const handleClickAddCount = () => onAddCount?.(meal.id, count);

    if (isLoading) return <Preloader />;

    return (
        <>
            <Features features={features} selected={selected} onSelectChoice={handleSelectChoice} />
            {!isBascket && (
                <div className={styles.buttons}>
                    <Counter count={count} increment={handleClickIncrement} decrement={handleClickDecrement} />
                    <Button onClick={handleClickAddCount}>
                        <span>{`${meal.price} ₸`}</span> <span>{t('pages.admin.inBasket')}</span>
                    </Button>
                </div>
            )}
        </>
    );
}

function AdminMealCard({ meal, restaurantId, onAdd, onAddCount, onDelete, isBascket, counter }: { meal: AdminMeal; restaurantId: number; onAdd?: (mealId: number) => void; onAddCount?: (mealId: number, count: number) => void; onDelete?: (mealId: number) => void; isBascket?: boolean; counter?: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClickAdd = () => onAdd?.(meal.id);
    const handleClickOpen = () => setIsOpen((prev) => !prev);

    const toggleButton = () => {
        if (!meal.hasFeatures) return null;
        return <button className={`${styles.meal__toggle} ${isOpen ? '' : styles.meal__toggle_hide}`} onClick={handleClickOpen} />;
    };

    return (
        <div className={`${styles.meal} ${isOpen ? styles.meal__open : ''}`}>
            {isBascket ? (
                <>
                    {toggleButton()}
                    <div className={styles.meal__info}>
                        <div className={styles['meal__bascket-photo']} style={{ backgroundImage: `url(${meal.photo})` }} />
                        <div className={styles.meal__management}>
                            <div className={styles['meal__conteiner-name']}>
                                <h3>{meal.name}</h3>
                                {meal.description && <p>{meal.description}</p>}
                            </div>
                            {counter && (
                                <div className={styles.meal__counter}>
                                    {counter}
                                    <p className={styles.meal__price}>{`${meal.price} ₸`}</p>
                                    {onDelete && <button className={styles.meal__delete} onClick={() => onDelete(meal.id)} />}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles['meal__conteiner-short']}>
                    {toggleButton()}
                    <button className={styles.meal__add_wrapper} onClick={handleClickAdd}>
                        <div className={styles.meal__add}></div>
                    </button>
                    <div className={styles.meal__photo} style={{ backgroundImage: `url(${meal.photo})` }} />
                    <div className={styles['meal__conteiner-name']}>
                        <h3>{meal.name}</h3>
                        {meal.description && <p>{meal.description}</p>}
                    </div>
                </div>
            )}
            {isOpen && meal.hasFeatures && <Details meal={meal} restaurantId={restaurantId} onAddCount={onAddCount} isBascket={isBascket} />}
        </div>
    );
}

export default AdminMealCard;
