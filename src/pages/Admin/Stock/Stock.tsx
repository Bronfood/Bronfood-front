import Preloader from '../../../components/Preloader/Preloader';
import { useGetMealsStock } from '../../../utils/hooks/useAdminStock/useAdminStock';
import { useTranslation } from 'react-i18next';
import styles from './Stock.module.scss';
import { useState } from 'react';
import Button from '../../../components/ButtonIconSquare/ButtonIconSquare';
import { useNavigate } from 'react-router-dom';

function Stock() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: meals, isLoading: isLoadingMeals } = useGetMealsStock();

    const [overrides, setOverrides] = useState<Record<number, boolean>>({});
    const [isOpen, setIsOpen] = useState<number | null>(null);
    const [selected, setSelected] = useState<Record<number, boolean>>({});

    const handleSelectChoice = (choiceId: number, current: boolean) => {
        setSelected((prev) => ({ ...prev, [choiceId]: !current }));
    };

    const handleVisibleToggle = (mealId: number, current: boolean) => {
        setOverrides((prev) => ({ ...prev, [mealId]: !current }));
    };

    const handleInfoToggle = (mealId: number) => {
        setIsOpen((prev) => (prev === mealId ? null : mealId));
    };

    const close = () => {
        navigate('/manager');
    };

    return (
        <div className={styles['stock']}>
            <div className={`${styles['stock__close']} ${styles['stock__close_button']}`}>
                <Button type="button" onClick={close} icon="close" />
            </div>
            {isLoadingMeals && <Preloader />}
            <h2 className={styles['stock__title']}>{t(`pages.admin.stock`)}</h2>
            {meals?.data ? (
                <ul className={styles['stock__meals']}>
                    {meals?.data.map((meal) => {
                        const isMealVisible = overrides[meal.id] ?? !!meal.is_visible;
                        return (
                            <>
                                <li key={meal.id} className={styles['stock__item']}>
                                    {!isMealVisible && <div className={styles['stock__item_overlay']}></div>}
                                    <div className={`${styles['stock__item_visible']} ${isMealVisible ? styles['stock__item_visible_active'] : ''}`}>
                                        <button className={`${styles['stock__item_visible_slider']} ${styles['stock__slider']} ${isMealVisible ? styles.active : ''}`} onClick={() => handleVisibleToggle(meal.id, isMealVisible)}>
                                            <span className={`${styles['stock__handle']} ${isMealVisible ? styles.active : ''}`} />
                                        </button>
                                    </div>
                                    <div className={styles['stock__short-info']}>
                                        <div className={styles['stock__item_photo']} style={{ backgroundImage: `url(${meal.photo})` }}></div>
                                        <div className={styles['stock__item_info']}>
                                            <p className={`${styles['stock__item_name']} ${styles['stock__item_text']}`}>{meal.name}</p>
                                            <p className={`${styles['stock__item_description']} ${styles['stock__item_text']} ${isOpen === meal.id ? styles.hide : ''}`}>{meal.description}</p>
                                        </div>
                                        <button className={styles['stock__button']} onClick={() => handleInfoToggle(meal.id)}>
                                            {isOpen === meal.id ? <div className={`${styles['stock__details']} ${styles['stock__details_hide']}`}></div> : <div className={`${styles['stock__details']} ${styles['stock__details_show']}`}></div>}
                                        </button>
                                    </div>
                                    {isOpen === meal.id && (
                                        <div className={styles['stock__detail-info']}>
                                            <p className={styles['stock__item_description']}>{meal.description}</p>
                                            {meal.features && meal.features.length > 0 && (
                                                <ul className={styles['stock__item_features']}>
                                                    {meal.features.map((feature) => (
                                                        <li key={feature.id} className={styles['stock__item_feature']}>
                                                            <p className={styles['stock__item_feature_name']}>{feature.name}</p>
                                                            {feature.choices.length > 0 && (
                                                                <ul className={styles['stock__item_feature_choices']}>
                                                                    {feature.choices.map((choice) => {
                                                                        const checked = selected[choice.id] ?? choice.is_visible ?? false;
                                                                        return (
                                                                            <li key={choice.id} className={styles['stock__item_feature_item']}>
                                                                                <label>
                                                                                    <p className={styles['stock__item_feature_item_name']}>{choice.name}</p>
                                                                                    <input type="checkbox" name={`choice-${meal.id}-${feature.id}-${choice.id}`} checked={checked} onChange={() => handleSelectChoice(choice.id, checked)}></input>
                                                                                </label>
                                                                            </li>
                                                                        );
                                                                    })}
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
                        );
                    })}
                </ul>
            ) : (
                <p>{t(`pages.admin.noAvailableMeal`)}</p>
            )}
        </div>
    );
}

export default Stock;
