import { useState } from 'react';
import { AdminMealStock, MealChoice, MealFeature } from '../../../utils/api/adminStockService/adminStockService';
import styles from './StockAdminMealCard.module.scss';

function Choice({ choice, checked, onChange, disabled }: { choice: MealChoice; checked: boolean; onChange: () => void; disabled?: boolean }) {
    return (
        <label className={styles.choice__label}>
            <p className={styles.choice__name}>{choice.name}</p>
            <input type="checkbox" checked={checked} onChange={onChange} className={styles.choice__checkbox} disabled={disabled}></input>
        </label>
    );
}

function Feature({ feature, onChoiceToggle }: { feature: MealFeature; onChoiceToggle: (choiceId: number, current: boolean, featureChoices?: MealChoice[]) => void }) {
    const visibleChoices = feature.choices.filter((c) => c.is_visible);

    const handleToggleChoice = (choice: MealChoice) => {
        const isHidingDefault = choice.is_visible && choice.default;
        if (isHidingDefault) {
            onChoiceToggle(choice.id, choice.is_visible, feature.choices);
        } else {
            onChoiceToggle(choice.id, choice.is_visible);
        }
    };

    return (
        <>
            <p className={styles.feature__name}>{feature.name}</p>
            {feature.choices.length > 0 && (
                <ul className={styles.feature__choices}>
                    {feature.choices.map((choice) => (
                        <li key={choice.id} className={styles.feature__choices_item}>
                            <Choice choice={choice} checked={choice.is_visible} onChange={() => handleToggleChoice(choice)} disabled={choice.is_visible && visibleChoices.length === 1} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

type StockAdminMealCardProps = {
    meal: AdminMealStock;
    isMealVisible: boolean;
    onVisibleToggle: () => void;
    onChoiceToggle: (choiceId: number, current: boolean, featureChoices?: MealChoice[]) => void;
};

function StockAdminMealCard({ meal, isMealVisible, onVisibleToggle, onChoiceToggle }: StockAdminMealCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClickOpen = () => setIsOpen((prev) => !prev);

    return (
        <li className={styles.meal}>
            {!isMealVisible && <div className={styles.meal__overlay}></div>}
            <div className={styles.meal__info_short}>
                <div className={styles.meal__photo} style={{ backgroundImage: `url(${meal.photo})` }}></div>
                <div className={styles.meal__info}>
                    <p className={`${styles.meal__name} ${styles.meal__text}`}>{meal.name}</p>
                    <p className={`${styles.meal__description} ${styles.meal__text} ${isOpen ? styles.meal__description_hide : ''}`}>{meal.description}</p>
                </div>
                <div className={`${styles.meal__visible} ${isMealVisible ? styles.meal__visible_active : ''}`}>
                    <button type="button" role="switch" aria-checked={isMealVisible} className={`${styles.meal__slider} ${isMealVisible ? styles.meal__slider_active : ''}`} onClick={onVisibleToggle}>
                        <span className={`${styles.meal__handle} ${isMealVisible ? styles.meal__handle_active : ''}`} />
                    </button>
                    <button type="button" className={`${styles.meal__toggle} ${isOpen ? '' : styles.meal__toggle_hide}`} onClick={handleClickOpen} />
                </div>
            </div>
            {isOpen && (
                <div className={styles.meal__info_detail}>
                    <p className={styles.meal__description}>{meal.description}</p>
                    {meal.features && meal.features.length > 0 && (
                        <ul className={styles.meal__features}>
                            {meal.features.map((feature) => (
                                <li key={feature.id}>
                                    <Feature feature={feature} onChoiceToggle={onChoiceToggle} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </li>
    );
}

export default StockAdminMealCard;
