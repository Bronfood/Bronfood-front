import ButtonIconRound from '../../../../../components/ButtonIconRound/ButtonIconRound';
import { CateringMeal } from '../../../../../utils/api/cateringService/cateringService';
import styles from './MealItem.module.scss';
import { useTranslation } from 'react-i18next';

type MealItemProps = {
    meal: CateringMeal;
    onClickInfo: () => void;
    onDelete: () => void;
    onEdit: () => void;
    isOpen: boolean;
    isVisible: boolean;
    onVisible: () => void;
    onDeleteAdditive: (type: string) => void;
};

const MealItem = ({ meal, onClickInfo, onDelete, onEdit, isOpen, isVisible, onVisible, onDeleteAdditive }: MealItemProps) => {
    const { t } = useTranslation();

    const isInfo = (meal.mealSizes && meal.mealSizes?.length > 0) || (meal.mealAdditives && meal.mealAdditives?.length > 0) || (meal.mealAdditives && meal.mealAdditives?.length > 0);

    return (
        <li className={styles.meal}>
            {!isVisible && <div className={styles.meal__overlay}></div>}
            <div className={styles.meal__image} style={{ backgroundImage: `url(${meal.photo})` }} />
            <div className={`${styles.meal__visible} ${!isVisible ? styles.meal__visible_active : ''}`}>
                <button onClick={onVisible} className={styles.meal__visible_button}>
                    {isVisible ? t('pages.cateringManagement.hideMealButton') : t('pages.cateringManagement.returnMealButton')}
                </button>
            </div>
            <div className={styles.meal__buttons}>
                <div className={styles.meal__button}>
                    <ButtonIconRound icon="edit" onClick={onEdit} />
                </div>
                <div className={styles.meal__button}>
                    <ButtonIconRound icon="delete" onClick={onDelete} />
                </div>
            </div>
            <div className={styles.meal__component}>
                <div className={styles.meal__info}>
                    <div className={styles.meal__title}>
                        <p className={styles.meal__title_name}>{meal.name}</p>
                        <p className={styles.meal__title_price}>{`${meal.price} ₸`}</p>
                    </div>
                    {meal.description && <p className={styles.meal__description}>{meal.description}</p>}
                </div>
                {isInfo && (
                    <button className={styles.meal__toggle} onClick={onClickInfo}>
                        {isOpen ? (
                            <div className={styles.meal__toggle_container}>
                                <p className={`${styles.meal__toggle_text} ${styles.meal__toggle_text_hide}`}>{t('pages.cateringManagement.collapseInfoMealButton')}</p>
                                <div className={`${styles.meal__toggle_image} ${styles.meal__toggle_hide}`}></div>
                            </div>
                        ) : (
                            <div className={styles.meal__toggle_container}>
                                <p className={styles.meal__toggle_text}>{t('pages.cateringManagement.showAllInfoMealButton')}</p>
                                <div className={`${styles.meal__toggle_image} ${styles.meal__toggle_show}`}></div>
                            </div>
                        )}
                    </button>
                )}
            </div>
            {isInfo && isOpen && (
                <ul className={styles.list}>
                    {meal.mealSizes && meal.mealSizes?.length > 0 && (
                        <li className={styles.list__unit}>
                            <div className={styles.list__header}>
                                <p className={styles.list__title}>{t('pages.cateringManagement.subtitleMealSizes')}</p>
                                <div className={styles.list__buttons}>
                                    <button className={`${styles.list__button} ${styles.list__edit}`}></button>
                                    <button className={`${styles.list__button} ${styles.list__delete}`} onClick={() => onDeleteAdditive('sizes')}></button>
                                </div>
                            </div>

                            <ul className={styles.list__sizes}>
                                {meal.mealSizes.map((size, index) => (
                                    <li key={index} className={`${styles.list__item} ${styles.list__size}`}>
                                        <p className={styles.list__item_size}>{size.size}</p>
                                        <p className={styles.list__item_price}>{`${size.price} ₸`}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )}

                    {meal.mealAdditives && meal.mealAdditives?.length > 0 && (
                        <li className={styles.list__unit}>
                            <div className={styles.list__header}>
                                <p className={styles.list__title}>{t('pages.cateringManagement.subtitleMealAdditives')}</p>
                                <div className={styles.list__buttons}>
                                    <button className={`${styles.list__button} ${styles.list__edit}`}></button>
                                    <button className={`${styles.list__button} ${styles.list__delete}`} onClick={() => onDeleteAdditive('additives')}></button>
                                </div>
                            </div>

                            <ul className={styles.list__additives}>
                                {meal.mealAdditives.map((additive, index) => (
                                    <li key={index} className={`${styles.list__item} ${styles.list__additive}`}>
                                        <p className={styles.list__item_title}>{additive.nameAdditive}</p>
                                        <ul className={styles.list__items}>
                                            {additive.additiveUnit.map((unit, index) => (
                                                <li key={index} className={styles.list__items_item}>
                                                    <p className={styles.list__item_name}>{unit.name}</p>
                                                    <p className={styles.list__item_price}>{`${unit.price} ₸`}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )}

                    {meal.mealSauces && meal.mealSauces?.length > 0 && (
                        <li className={styles.list__unit}>
                            <div className={styles.list__header}>
                                <p className={styles.list__title}>{t('pages.cateringManagement.subtitleMealSauces')}</p>
                                <div className={styles.list__buttons}>
                                    <button className={`${styles.list__button} ${styles.list__edit}`}></button>
                                    <button className={`${styles.list__button} ${styles.list__delete}`} onClick={() => onDeleteAdditive('sauces')}></button>
                                </div>
                            </div>

                            <ul className={`${styles.list__sauces}`}>
                                {meal.mealSauces.map((sauce, index) => (
                                    <li className={`${styles.list__item} ${styles.list__sauce} `} key={index}>
                                        <p className={styles.list__item_name}>{sauce.name}</p>
                                        <p className={styles.list__item_price}>{`${sauce.price} ₸`}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )}
                </ul>
            )}
        </li>
    );
};

export default MealItem;
