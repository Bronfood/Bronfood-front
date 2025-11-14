import { useRef, useState, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import RestaurantCard from '../../../components/Cards/RestaurantCard/RestaurantCard';
import styles from './Drawer.module.scss';
import Filter from '../../../components/Filter/Filter';
import { useRestaurantsContext } from '../../../utils/hooks/useRestaurants/useRestaurantsContext';
import Preloader from '../../../components/Preloader/Preloader';
import { useNavigate } from 'react-router-dom';
import PageNotFound from '../../PageNotFound/PageNotFound';

const Drawer = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { restaurantsFiltered, isLoading, isError, lastClickedRestaurantId, setLastClickedRestaurantId, setActiveRestaurant } = useRestaurantsContext();
    const { t } = useTranslation();
    const container = useRef(null);
    const navigate = useNavigate();

    const handleClick = (id: number) => {
        if (lastClickedRestaurantId === id) {
            navigate(`/restaurants/${id}`);
        } else {
            setActiveRestaurant(id);
            setLastClickedRestaurantId(id);
        }
    };

    if (isError) {
        return <PageNotFound />;
    } else {
        return (
            <div className={`${styles.drawer} ${styles.up} ${isOpen ? styles.open : ''}`}>
                <div className={styles.drawer__container}>
                    <button onClick={() => setIsOpen(!isOpen)} type="button" className={styles.drawer__tab_container}>
                        <div className={`${styles.drawer__tab} ${isOpen ? styles.drawer__tab_active : styles.drawer__tab_disabled}`} />
                    </button>
                    <div className={styles.drawer__title_container}>
                        <p className={styles.drawer__title}>{t('pages.restaurants.selectPlace')}</p>
                        <button onClick={() => setIsFilterOpen(true)} type="button" className={styles.drawer__icon} title={t('pages.restaurants.filters')} />
                    </div>
                    {isLoading && <Preloader />}
                    {restaurantsFiltered.length === 0 ? <p className={styles.drawer__message}>{t('pages.restaurants.noRestaurantsInYourCityYet')}</p> : null}
                    <ul ref={container} className={`${styles.drawer__list} bronfood-scrollbar`}>
                        {restaurantsFiltered.map((card) => (
                            <li key={card.id} className={styles.drawer__list_item} onClick={() => handleClick(card.id)}>
                                <RestaurantCard card={card} isTheOnlyOne={restaurantsFiltered.length === 1} lastClickedRestaurantId={lastClickedRestaurantId} />
                            </li>
                        ))}
                    </ul>
                </div>
                {isFilterOpen && <Filter name="filters" close={() => setIsFilterOpen(false)} />}
            </div>
        );
    }
};
export default Drawer;
