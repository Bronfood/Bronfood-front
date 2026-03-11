import styles from './AdditivesStep.module.scss';
import { useTranslation } from 'react-i18next';
import ButtonIconAdd from '../../../../../components/ButtonIconAdd/ButtonIconAdd';
import { useState } from 'react';
import AddAdditivePopup from './AddAdditivePopup/AddAdditivePopup';
import { useGetCateringMealById } from '../../../../../utils/hooks/useCateringMeal/useCateringMeal';
import { useParams } from 'react-router-dom';

const AdditivesStep = () => {
    const { t } = useTranslation();
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const { cateringMealId, cateringId } = useParams();

    const { data } = useGetCateringMealById(Number(cateringId), Number(cateringMealId));

    const handleOpenPopup = () => setOpenPopup(true);

    const handleClosePopup = () => setOpenPopup(false);

    return (
        <fieldset className={styles.fieldset}>
            <div className={styles.list__header}>
                <p className={styles.list__title}>{t('pages.cateringManagement.subtitleMealAdditives')}</p>
            </div>
            {data && data.data.features ? (
                <ul className={`${styles.list__items} ${styles.list__items_additive}`}>
                    {data.data.features.map((feature) => (
                        <li className={`${styles.list__item} ${styles.list__additive}`} key={feature.id}>
                            <p className={styles.list__additive_name}>{feature.name}</p>
                            <button className={styles.list__edit} onClick={handleOpenPopup}></button>
                            <ul className={styles.list__additives}>
                                {feature.choices.map((choice) => (
                                    <li key={choice.id} className={styles.list__additives_item}>
                                        <p className={styles.list__additives_name}>{choice.name}</p>
                                        <p className={styles.list__additives_price}>{`${choice.price} ₸`}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : null}
            {openPopup && <AddAdditivePopup onClose={handleClosePopup} />}
            <ButtonIconAdd onClick={handleOpenPopup}>{t('pages.cateringManagement.addAdditionsToMeal')}</ButtonIconAdd>
        </fieldset>
    );
};

export default AdditivesStep;
