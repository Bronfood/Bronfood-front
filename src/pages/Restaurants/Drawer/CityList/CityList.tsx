import { useTranslation } from 'react-i18next';
import styles from './CityList.module.scss';
import { useMapContext } from '../../../../utils/hooks/useMap/useMap';
import { ZOOM } from '../../../../utils/consts';
import { City } from '../../../../utils/api/mapService/mapService';

const CityList = () => {
    const { t } = useTranslation();
    const { setLocation, setMapBottomMargin, cities } = useMapContext();
    const handleClick = (city: City) => {
        setLocation((location) => {
            return { ...location, center: [city.coordinates.longitude, city.coordinates.latitude], zoom: ZOOM };
        });
        setMapBottomMargin(460);
    };
    return (
        <div className={styles['city-list']}>
            <p className={styles['city-list__message']}>{t('pages.restaurants.noRestaurantsInYourCityYet')}</p>
            <ul className={`${styles['city-list__list']} bronfood-scrollbar`}>
                {cities.map((city, index) => (
                    <li key={`${city}-${index}`} className={styles['city-list__link']} onClick={() => handleClick(city)}>
                        <p className={styles['city-list__city']}>{city.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CityList;
