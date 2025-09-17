import { Dispatch, SetStateAction, useEffect, useState, useMemo, useCallback } from 'react';
import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener } from '../../lib/ymaps';
import { type MapEventUpdateHandler, type BehaviorMapEventHandler, LngLat } from '@yandex/ymaps3-types';
import styles from './YandexMap.module.scss';
import { useRestaurantsContext } from '../../utils/hooks/useRestaurants/useRestaurantsContext';
import { useNavigate } from 'react-router-dom';
import marker from '../../vendor/images/icons/navigation.svg';
import markerActive from '../../vendor/images/icons/navigation_active.png';
import userMarker from '../../vendor/images/icons/navigation_grey.svg';
import { debounce } from 'lodash';
import { DEBOUNCE_VALUE } from '../../utils/consts';

export default function YandexMap({ setCity }: { setCity: Dispatch<SetStateAction<string>> }) {
    const [initialRender, setInitialRender] = useState(true);
    const [center, setCenter] = useState<LngLat>([76.921552, 43.246345]);
    const [zoom, setZoom] = useState(12);
    const [activePlaceId, setActivePlaceId] = useState<number | null>(null);
    const navigate = useNavigate();
    const { restaurantsFiltered, inView, setLastClickedRestaurantId, setBounds, userLocation, setUserLocation } = useRestaurantsContext();

    const handleMapUpdate: MapEventUpdateHandler = useCallback(
        (object) => {
            const boundsCoords = object.location.bounds;
            setInitialRender(false);
            setBounds(boundsCoords);
        },
        [setBounds]
    );

    const createBehaviorEventHandler = useCallback((): BehaviorMapEventHandler => {
        return debounce(function (object) {
            if (object.type === 'dblClick') return;
            const boundsCoords = object.location.bounds;
            setCenter(object.location.center);
            setZoom(object.location.zoom);
            setBounds(boundsCoords);
        }, DEBOUNCE_VALUE);
    }, [setBounds]);

    const handlePlacemarkClick = (placeId: number, longitude: number, latitude: number) => {
        setLastClickedRestaurantId(placeId);
        setCenter([longitude, latitude]);
        navigate(`/restaurants/${placeId}`);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.longitude, position.coords.latitude]);
                setCenter([position.coords.longitude, position.coords.latitude]);
            });
        }
    }, [setUserLocation]);

    useEffect(() => {
        if (inView && activePlaceId !== inView) {
            setActivePlaceId(inView);
            const place = restaurantsFiltered.find((place) => place.id === inView);
            if (place) {
                setCenter([place.coordinates.longitude, place.coordinates.latitude]);
                if (zoom < 12) {
                    setZoom(12);
                }
            }
        }
    }, [inView, restaurantsFiltered, activePlaceId, zoom]);

    useEffect(() => {
        async function fetchLocality() {
            setCity('');
            const res = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_YNDX_API_KEY}&geocode=${userLocation}&format=json`);
            if (res.ok) {
                const result = await res.json();
                if (!ignore) {
                    const locality = result.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components.filter((c: { kind: string; name: string }) => c.kind === 'locality')[0].name;
                    setCity(locality);
                }
            }
        }
        let ignore = false;
        if (userLocation) {
            fetchLocality();
        }
        return () => {
            ignore = true;
        };
    }, [userLocation, setCity]);

    return (
        <div className={styles.yamap}>
            <YMap location={{ center: center, zoom: zoom }} margin={[100, 10, 40, 10]}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapListener onActionEnd={useMemo(() => createBehaviorEventHandler(), [createBehaviorEventHandler])} onUpdate={initialRender ? handleMapUpdate : null} />
                {restaurantsFiltered.map((place) => {
                    const active = activePlaceId === place.id;
                    return (
                        <YMapMarker key={place.id} coordinates={[place.coordinates.longitude, place.coordinates.latitude]} draggable={false} onClick={() => handlePlacemarkClick(place.id, place.coordinates.longitude, place.coordinates.latitude)} zIndex={active ? 10 : 0}>
                            <img className={`${styles.yamap__marker} ${active ? styles.yamap__marker_active : ''}`} src={active ? markerActive : marker}></img>
                        </YMapMarker>
                    );
                })}
                {userLocation && (
                    <YMapMarker key={userLocation[0]} coordinates={userLocation} draggable={false}>
                        <img className={styles.yamap__marker} src={userMarker} />
                    </YMapMarker>
                )}
            </YMap>
        </div>
    );
}
