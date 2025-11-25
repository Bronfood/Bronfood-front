import { FC } from 'react';
import { MealChoice, UserOrderMeal } from '../../../../utils/api/orderService/orderService';
import styles from './MyOrderMeal.module.scss';
import { useTranslation } from 'react-i18next';

const Choices: FC<{ choices: MealChoice[] }> = ({ choices }) => {
    return (
        <ul className={styles['choices']}>
            {choices.map((choice, index) => (
                <li key={index}>
                    <p className={styles['choices__name']}>• {choice.name}</p>
                </li>
            ))}
        </ul>
    );
};

const MyOrderMeal: FC<{ meal: UserOrderMeal }> = ({ meal }) => {
    const { t } = useTranslation();
    return (
        <li className={`${meal.is_available ? styles['meal'] : styles['meal-unavailable']}`}>
            <div className={styles['meal__info']}>
                <p className={styles['meal__name']}>
                    {meal.name}
                    <span className={styles['meal__count']}>x{meal.count}</span>
                </p>
                <p className={`${styles['meal__price']} ${meal.is_available ? '' : styles['meal__price_unavailable']}`}>
                    {meal.price} <span>₸</span>
                </p>
            </div>
            <Choices choices={meal.choices} />
            {meal.is_available ? null : (
                <>
                    <div className={styles['meal__unavailable-wrapper']}></div>
                    <div className={styles['meal__unavailable']}>
                        <p className={styles['meal__unavailable_text']}>{t('pages.order.mealUnavailable')}</p>
                    </div>
                </>
            )}
        </li>
    );
};

export default MyOrderMeal;
