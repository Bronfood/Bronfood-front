import Preloader from '../../../components/Preloader/Preloader';
import { useGetMealsStock } from '../../../utils/hooks/useAdminStock/useAdminStock';
import AdminPopup from '../AdminPopup/AdminPopup';
import { useTranslation } from 'react-i18next';
import styles from './Stock.module.scss';
import { useState } from 'react';

function Stock() {
    const { t } = useTranslation();
    const { data: meals, isLoading: isLoadingMeals } = useGetMealsStock();

    const [isVisible, setIsVisible] = useState<number | null>(null);
    const [isInfo, setIsInfo] = useState<number | null>(null);

    const handleVisibleToggle = (mealId: number) => {
        setIsVisible((prev) => (prev === mealId ? null : mealId));
    };

    const handleInfoToggle = (mealId: number) => {
        setIsInfo((prev) => (prev === mealId ? null : mealId));
    };

    return (
        <>
            <AdminPopup close={close}>
                {isLoadingMeals && <Preloader />}
                <h1 className={styles['stock__title']}>{t(`pages.admin.stock`)}</h1>
                {meals?.data ? (
                    <ul className={styles['stock__meals']}>
                        {meals?.data.map((meal) => (
                            <>
                                <li key={meal.id} className={styles['stock__item']}>
                                    <div className={`${styles['stock__short_meal-visible']} ${isVisible === meal.id ? styles['stock__short_meal-visible_active'] : ''}`}></div>
                                    <div className={styles['stock__short-info']}>
                                        <div className={styles['stock__item_photo']} style={{ backgroundImage: `url(${meal.photo})` }}></div>
                                        <div className={styles['stock__item_info']}>
                                            <p className={`${styles['stock__item_name']} ${styles['stock__item_text']}`}>{meal.name}</p>
                                            <p className={`${styles['stock__item_description']} ${styles['stock__item_text']} ${isInfo === meal.id ? styles.hide : ''}`}>{meal.description}</p>
                                        </div>
                                        <div className={styles['stock__buttons']}>
                                            <button className={`${styles['stock__button']} ${styles['stock__slider']} ${isVisible === meal.id ? styles.active : ''}`} onClick={() => handleVisibleToggle(meal.id)}>
                                                <span className={`${styles['stock__handle']} ${isVisible === meal.id ? styles.active : ''}`} />
                                            </button>
                                            <button className={styles['stock__button']} onClick={() => handleInfoToggle(meal.id)}>
                                                {isInfo === meal.id ? <div className={`${styles['stock__details']} ${styles['stock__details_hide']}`}></div> : <div className={`${styles['stock__details']} ${styles['stock__details_show']}`}></div>}
                                            </button>
                                        </div>
                                    </div>
                                    {isInfo === meal.id && (
                                        <div className={styles['stock__detail-info']}>
                                            <p className={styles['stock__item_description']}>{meal.description}</p>
                                            {meal.features && meal.features.length > 0 && (
                                                <ul className={styles['stock__item_additives']}>
                                                    {meal.features.map((feature) => (
                                                        <li key={feature.id} className={styles['stock__item_additive']}>
                                                            <p className={styles['stock__item_additive_name']}>{feature.name}</p>
                                                            {feature.choices.length > 0 && (
                                                                <ul className={styles['stock__item_additive_choices']}>
                                                                    {feature.choices.map((choice) => (
                                                                        <li key={choice.id} className={styles['stock__item_additive_choice']}>
                                                                            {choice.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </li>
                            </>
                        ))}
                    </ul>
                ) : (
                    <p>{t(`pages.admin.noAvailableMeal`)}</p>
                )}
            </AdminPopup>
        </>
    );
}

export default Stock;
