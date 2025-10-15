import { Dispatch, SetStateAction, useEffect, useState, useMemo, useCallback } from 'react';
import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener, YMapClusterer, clusterByGrid } from '../../lib/ymaps';
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
    const gridSizedMethod = useMemo(() => clusterByGrid({ gridSize: 64 }), []);

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
            console.log(object);
            if (object.type === 'dblClick') return;
            setZoom(object.location.zoom);
            setCenter(object.location.center);
            const boundsCoords = object.location.bounds;
            setBounds(boundsCoords);
        }, DEBOUNCE_VALUE);
    }, [setBounds]);

    const handlePlacemarkClick = useCallback(
        (placeId: number, longitude: number, latitude: number) => {
            setLastClickedRestaurantId(placeId);
            setCenter([longitude, latitude]);
            navigate(`/restaurants/${placeId}`);
        },
        [navigate, setLastClickedRestaurantId]
    );

    const points = restaurantsFiltered.map((restaurant) => ({
        type: 'Feature',
        id: restaurant.id,
        geometry: { coordinates: [restaurant.coordinates.longitude, restaurant.coordinates.latitude], type: 'Point' },
    }));

    const mapMarker = useCallback(
        (place) => {
            const active = activePlaceId === place.id;
            return (
                <YMapMarker key={place.id} coordinates={place.geometry.coordinates} draggable={false} onClick={() => handlePlacemarkClick(place.id, place.geometry.coordinates[0], place.geometry.coordinates[1])} zIndex={active ? 10 : 0}>
                    <img className={`${styles.yamap__marker} ${active ? styles.yamap__marker_active : ''}`} src={active ? markerActive : marker}></img>
                </YMapMarker>
            );
        },
        [activePlaceId, handlePlacemarkClick]
    );

    const cluster = useCallback((coordinates, features) => {
        return (
            <YMapMarker coordinates={coordinates}>
                <div className={styles.yamap__cluster}>
                    <div className={styles.yamap__cluster_content}>
                        <span className={styles.yamap__cluster_text}>{features.length}</span>
                    </div>
                </div>
            </YMapMarker>
        );
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.longitude, position.coords.latitude]);
                setCenter([position.coords.longitude, position.coords.latitude]);
            });
        }
    }, [setUserLocation, setCenter]);

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
            <YMap location={{ center: center, zoom: zoom }} margin={[100, 10, 40, 10]} showScaleInCopyrights={true}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapListener onActionEnd={useMemo(() => createBehaviorEventHandler(), [createBehaviorEventHandler])} onUpdate={initialRender ? handleMapUpdate : null} on />
                <YMapClusterer marker={mapMarker} cluster={cluster} method={gridSizedMethod} features={points} />
                {userLocation && (
                    <YMapMarker key={userLocation[0]} coordinates={userLocation} draggable={false}>
                        <img className={styles.yamap__marker} src={userMarker} />
                    </YMapMarker>
                )}
            </YMap>
        </div>
    );
}
