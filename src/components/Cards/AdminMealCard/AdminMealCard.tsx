import { useTranslation } from 'react-i18next';
import { Feature, Meal } from '../../../utils/api/restaurantsService/restaurantsService';
import styles from './AdminMealCard.module.scss';
import { ReactNode, useMemo, useState } from 'react';
import Button from '../../Button/Button';
import Counter from '../../Counter/Counter';
import Preloader from '../../Preloader/Preloader';
import { useFeatures } from '../../../utils/hooks/useFeatures/useFeatures';
import { groupBy, sumBy } from 'lodash';
import { MealForBasket } from '../../../utils/api/adminBasketService/adminBasketService';

type AdminMealCard = {
    meal: Meal;
    basketItem?: MealForBasket;
    restaurantId: number;
    onAdd?: (mealId: number, features: { featureId: number; choiceId: number }[]) => void;
    onAddCount?: (mealId: number, count: number, features: { featureId: number; choiceId: number }[]) => void;
    onDelete?: (mealId: number) => void;
    isBascket?: boolean;
    counter?: ReactNode;
    errorMessage?: string;
};

const isSizeFeature = (name?: string) => {
    const normalized = (name ?? '').trim().toLowerCase().replace(/ё/g, 'е');
    return normalized.includes('размер') || normalized.includes('объем');
};

const getChoiceIds = (feature: Feature, selected: Record<number, number[]>): number[] => {
    if (selected[feature.id]) return selected[feature.id];

    if (feature.selection_type === 'multiple') return feature.choices.filter((c) => c.default).map((c) => c.id);

    const defaultId = feature.choices.find((c) => c.default)?.id;
    if (feature.selection_type === 'optional') return defaultId != null ? [defaultId] : [];

    const singleId = defaultId ?? feature.choices[0]?.id;
    return singleId != null ? [singleId] : [];
};

function Features({ features, selected, onSelectChoice }: { features: Feature[]; selected: Record<number, number[]>; onSelectChoice: (feature: Feature, choiceId: number) => void }) {
    if (features.length === 0) return null;

    return (
        <ul className={styles.features}>
            {features.map((feature) => {
                const isSize = isSizeFeature(feature.name);
                const currentIds = getChoiceIds(feature, selected);
                const inputType = feature.selection_type === 'single' ? 'radio' : 'checkbox';

                return (
                    <li key={feature.id} className={styles.features__item}>
                        <p className={styles.features__item_name}>{feature.name}</p>
                        <ul className={`${isSize ? styles['choices-size'] : styles.choices}`}>
                            {feature.choices.map((choice) => {
                                const isChecked = currentIds.includes(choice.id);
                                return (
                                    <li key={choice.id} className={`${isSize ? styles['choices__item-size'] : styles.choices__item} ${isSize && isChecked ? styles['choices__item-size_default'] : ''}`}>
                                        <label className={`${isSize ? styles['choices__item_label-size'] : styles.choices__item_label}`}>
                                            <p className={`${isSize ? styles['choices__item_name-size'] : styles.choices__item_name}`}>{choice.name}</p>
                                            <p className={`${isSize ? styles['choices__item_price-size'] : styles.choices__item_price}`}>{`${choice.price} ₸`}</p>
                                            <input type={inputType} name={`feature-${feature.id}`} value={choice.id} checked={isChecked} onChange={() => onSelectChoice(feature, choice.id)} />
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                );
            })}
        </ul>
    );
}

function FeaturesBasket({ basketItem }: { basketItem: MealForBasket }) {
    if (!basketItem.choices || basketItem.choices.length === 0) return null;

    const grouped = groupBy(basketItem.choices, 'feature_name');

    return (
        <ul className={styles.features}>
            {Object.entries(grouped).map(([featureName, featureChoices]) => {
                const isSize = isSizeFeature(featureName);

                return (
                    <li key={featureName} className={styles.features__item}>
                        <p className={styles.features__item_name}>{featureName}</p>
                        <ul className={`${isSize ? styles['choices-size'] : styles.choices}`}>
                            {featureChoices.map((choice) => (
                                <li key={choice.id} className={`${isSize ? styles['choices__item-size'] : styles.choices__item} ${isSize ? styles['choices__item-size_default'] : ''}`}>
                                    <label className={`${isSize ? styles['choices__item_label-size'] : styles.choices__item_label}`}>
                                        <p className={`${isSize ? styles['choices__item_name-size'] : styles.choices__item_name}`}>{choice.name}</p>
                                        <p className={`${isSize ? styles['choices__item_price-size'] : styles.choices__item_price}`}>{`${choice.price} ₸`}</p>
                                        <input type="radio" name={`feature-${basketItem.id}-${featureName}-${choice.id}`} value={choice.id} checked readOnly tabIndex={-1} />
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

function Details({ meal, restaurantId, onAddCount }: { meal: Meal; restaurantId: number; onAddCount?: (mealId: number, count: number, features: { featureId: number; choiceId: number }[]) => void }) {
    const { t } = useTranslation();
    const { data: featuresData, isLoading } = useFeatures(restaurantId, meal.id);
    const features = useMemo(() => featuresData?.data ?? [], [featuresData]);

    const [selected, setSelected] = useState<Record<number, number[]>>({});
    const [count, setCount] = useState<number>(1);

    const handleSelectChoice = (feature: Feature, choiceId: number) => {
        setSelected((prev) => {
            const current = getChoiceIds(feature, prev);
            const isChecked = current.includes(choiceId);

            let next: number[];
            if (feature.selection_type === 'single') next = [choiceId];
            else if (feature.selection_type === 'optional') next = isChecked ? [] : [choiceId];
            else next = isChecked ? current.filter((id) => id !== choiceId) : [...current, choiceId];

            return { ...prev, [feature.id]: next };
        });
    };

    const price = useMemo(() => {
        let base = meal.price;
        let additions = 0;

        features.forEach((feature) => {
            const ids = getChoiceIds(feature, selected);
            const chosen = feature.choices.filter((c) => ids.includes(c.id));

            if (feature.pricing_strategy === 'override') {
                if (chosen[0]) base = chosen[0].price;
            } else {
                additions += sumBy(chosen, 'price');
            }
        });

        return (base + additions) * count;
    }, [features, selected, meal.price, count]);

    const buildFeatures = (): { featureId: number; choiceId: number }[] => features.flatMap((feature) => getChoiceIds(feature, selected).map((choiceId) => ({ featureId: feature.id, choiceId })));

    const handleClickIncrement = () => setCount((prev) => prev + 1);
    const handleClickDecrement = () => setCount((prev) => Math.max(1, prev - 1));
    const handleClickAddCount = () => onAddCount?.(meal.id, count, buildFeatures());

    if (isLoading) {
        return (
            <div className={styles.preloader}>
                <Preloader />
            </div>
        );
    }
    return (
        <>
            <p className={styles.description}>{meal.description}</p>
            <Features features={features} selected={selected} onSelectChoice={handleSelectChoice} />
            <div className={styles.buttons}>
                <Counter count={count} increment={handleClickIncrement} decrement={handleClickDecrement} />
                <Button type="button" onClick={handleClickAddCount}>
                    <span>{`${price} ₸`}</span> <span>{t('pages.admin.inBasket')}</span>
                </Button>
            </div>
        </>
    );
}

function DetailsBasket({ basketItem }: { basketItem: MealForBasket }) {
    return (
        <>
            <p className={styles.description}>{basketItem.meal.description}</p>
            <FeaturesBasket basketItem={basketItem} />
        </>
    );
}

function AdminMealCard({ meal, basketItem, restaurantId, onAdd, onAddCount, onDelete, isBascket, counter, errorMessage }: AdminMealCard) {
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);

    const isBasketItemUnavailable = (item: MealForBasket) => Boolean(item.is_deleted || item.is_visible === false || item.choices?.some((c) => c.is_deleted || c.is_visible === false));
    const isUnavailable = isBascket && !!basketItem && isBasketItemUnavailable(basketItem);
    const message = errorMessage || (isUnavailable ? t('pages.admin.mealUnavailable') : '');

    const handleClickAdd = () => {
        if (meal.hasFeatures) {
            setIsOpen(true);
            return;
        }
        onAdd?.(meal.id, []);
    };
    const handleClickOpen = () => setIsOpen((prev) => !prev);

    const toggleButton = () => {
        if (!meal.hasFeatures) return null;
        return <button className={`${styles.meal__toggle} ${isOpen ? '' : styles.meal__toggle_hide}`} onClick={handleClickOpen} />;
    };

    const renderErrorComponent = () => {
        if (!message) return null;
        return (
            <div className={styles.meal__error}>
                <div />
                <span>{message}</span>
            </div>
        );
    };

    return (
        <div className={`${styles.meal} ${isOpen ? styles.meal__open : ''} ${isUnavailable ? styles.meal__unavailable : ''}`}>
            {isBascket ? (
                <>
                    {toggleButton()}
                    <div className={styles.meal__info}>
                        <div className={styles['meal__bascket-photo']} style={meal.photo ? { backgroundImage: `url(${meal.photo})` } : undefined} />
                        <div className={styles.meal__management}>
                            <div className={`${styles['meal__conteiner-name']} ${meal.hasFeatures === false ? styles['meal__conteiner-name_not-features'] : ''}`}>
                                <h3>{meal.name}</h3>
                                <p className={`${styles.meal__description} ${isOpen ? styles.meal__description_hide : ''}`}>{meal.description}</p>
                            </div>
                            {counter && (
                                <div className={styles.meal__counter}>
                                    {counter}
                                    <p className={styles.meal__price}>{`${basketItem?.price ?? meal.price} ₸`}</p>
                                    {onDelete && <button className={styles.meal__delete} onClick={() => onDelete(meal.id)} />}
                                </div>
                            )}
                        </div>
                    </div>
                    {!isOpen && renderErrorComponent()}
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
                        <p className={`${styles.meal__description} ${isOpen ? styles.meal__description_hide : ''}`}>{meal.description}</p>
                    </div>
                    {!isOpen && renderErrorComponent()}
                </div>
            )}
            {isOpen && renderErrorComponent()}
            {isOpen && (isBascket ? basketItem && <DetailsBasket basketItem={basketItem} /> : <Details meal={meal} restaurantId={restaurantId} onAddCount={onAddCount} />)}
        </div>
    );
}

export default AdminMealCard;
