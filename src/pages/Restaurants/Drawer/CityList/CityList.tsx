import { useTranslation } from 'react-i18next';
import styles from './CityList.module.scss';
import { useMapContext } from '../../../../utils/hooks/useMap/useMap';
import { ZOOM } from '../../../../utils/consts';

const CityList = () => {
    const { t } = useTranslation();
    type City = {
        id: number;
        name: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    const cities: City[] = [
        {
            id: 1,
            name: 'Алматы',
            coordinates: {
                latitude: 43.239491,
                longitude: 76.945435,
            },
        },
        {
            id: 2,
            name: 'Астана',
            coordinates: {
                latitude: 51.129947,
                longitude: 71.430053,
            },
        },
    ];
    const { setLocation, setMapBottomMargin } = useMapContext();
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
