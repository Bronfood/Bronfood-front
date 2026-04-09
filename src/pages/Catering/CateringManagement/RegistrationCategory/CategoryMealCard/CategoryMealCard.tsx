import ButtonIconRound from '../../../../../components/ButtonIconRound/ButtonIconRound';
import { CateringMeal } from '../../../../../utils/api/cateringMealService/cateringMealService';
import styles from './CategoryMealCard.module.scss';

type CategoryMealCardProps = {
    meal: CateringMeal;
    onDelete?: () => void;
    onToggle?: () => void;
    isChecked?: boolean;
    available?: boolean;
};

const CategoryMealCard = ({ meal, onDelete, onToggle, isChecked = false, available }: CategoryMealCardProps) => {
    return (
        <li className={styles.card}>
            <div className={!available ? '' : styles.card__overlay}></div>
            <div className={styles.card__content}>
                <div className={styles.card__photo} style={{ backgroundImage: `url(${meal.photo})` }}></div>
                {available && (
                    <div className={styles.card__checkbox}>
                        <input name={`meal-${meal.id}`} type="checkbox" className={styles.card__checkbox_include} checked={isChecked} onChange={onToggle} />
                    </div>
                )}
                {!available && (
                    <div className={styles.card__exclude}>
                        <ButtonIconRound type="button" icon="delete" onClick={onDelete} />
                    </div>
                )}
            </div>
            <div className={styles.card__info}>
                <p className={styles.card__name}>{meal.name}</p>
                <p className={styles.card__price}>{`${meal.base_price} ₸`}</p>
            </div>
        </li>
    );
};

export default CategoryMealCard;
