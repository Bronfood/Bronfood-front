import { useState } from 'react';
import { AdminMealStock, MealChoice, MealFeature } from '../../../utils/api/adminStockService/adminStockService';
import styles from './StockAdminMealCard.module.scss';

function Choice({ choice, checked, onChange }: { choice: MealChoice; checked: boolean; onChange: () => void }) {
    return (
        <>
            <label className={styles.choice__label}>
                <p className={styles.choice__name}>{choice.name}</p>
                <input type="checkbox" name={`choice-${choice.id}`} checked={checked} onChange={onChange} className={styles.choice__checkbox}></input>
            </label>
        </>
    );
}

function Feature({ feature, onChoiceToggle }: { feature: MealFeature; onChoiceToggle: (choiceId: number, current: boolean) => void }) {
    return (
        <>
            <p className={styles.feature__name}>{feature.name}</p>
            {feature.choices.length > 0 && (
                <ul className={styles.feature__choices}>
                    {feature.choices.map((choice) => (
                        <li key={choice.id} className={styles.feature__choices_item}>
                            <Choice choice={choice} checked={choice.is_visible} onChange={() => onChoiceToggle(choice.id, choice.is_visible)} />
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
    onChoiceToggle: (choiceId: number, current: boolean) => void;
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
                    <button type="button" className={`${styles.meal__slider} ${isMealVisible ? styles.meal__slider_active : ''}`} onClick={onVisibleToggle}>
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
