import ButtonIconRound from '../../../../../components/ButtonIconRound/ButtonIconRound';
import { CateringMeal } from '../../../../../utils/api/cateringService/cateringService';
import styles from './CategoryMealCard.module.scss';

type CategoryMealCardProps = {
    meal: CateringMeal;
    onDelete?: () => void;
    onToggle?: () => void;
    isChecked?: boolean;
    includes?: boolean;
    exclude?: boolean;
};

const CategoryMealCard = ({ meal, onDelete, onToggle, isChecked = false, includes, exclude }: CategoryMealCardProps) => {
    return (
        <li className={styles.card}>
            <div className={exclude ? '' : styles.card__overlay}></div>
            <div className={styles.card__content}>
                <div className={styles.card__photo} style={{ backgroundImage: `url(${meal.photo})` }}></div>
                {includes && (
                    <div className={styles.card__checkbox}>
                        <input name={`meal-${meal.id}`} type="checkbox" className={styles.card__checkbox_include} checked={isChecked} onChange={onToggle} />
                    </div>
                )}
                {exclude && (
                    <div className={styles.card__exclude}>
                        <ButtonIconRound icon="delete" onClick={onDelete} />
                    </div>
                )}
            </div>
            <div className={styles.card__info}>
                <p className={styles.card__name}>{meal.name}</p>
                <p className={styles.card__price}>{`${meal.price} ₸`}</p>
            </div>
        </li>
    );
};

export default CategoryMealCard;
