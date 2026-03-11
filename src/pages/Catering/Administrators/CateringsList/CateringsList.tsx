import RestaurantCardCompact from '../../../../components/Cards/RestaurantCardCompact/RestaurantCardCompact';
import { Catering } from '../../../../utils/api/cateringService/cateringService';
import styles from './CateringsList.module.scss';
import { useTranslation } from 'react-i18next';

const CateringsList = ({ caterings, onClick }: { caterings: Catering[]; onClick: (id: number) => void }) => {
    const { t } = useTranslation();
    return (
        <div className={styles['restaurant__container']}>
            <p className={styles['restaurant__title']}>{t('pages.administrators.chooseAnRestaurant')}</p>
            <ul className={styles['restaurant__list']}>
                {caterings.map((catering) => (
                    <li key={catering.id} onClick={() => onClick(catering.id)}>
                        <RestaurantCardCompact card={catering} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CateringsList;
