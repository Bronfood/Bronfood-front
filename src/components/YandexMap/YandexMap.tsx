import { useEffect, useState, useMemo, useCallback } from 'react';
import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener, YMapClusterer, clusterByGrid } from '../../lib/ymaps';
import { type MapEventUpdateHandler, type BehaviorMapEventHandler, LngLat } from '@yandex/ymaps3-types';
import styles from './YandexMap.module.scss';
import { useRestaurantsContext } from '../../utils/hooks/useRestaurants/useRestaurantsContext';
import { useNavigate } from 'react-router-dom';
import marker from '../../vendor/images/icons/navigation.svg';
import markerActive from '../../vendor/images/icons/navigation_active.png';
import userMarker from '../../vendor/images/icons/navigation_grey.svg';
import { debounce } from 'lodash';
import { CLUSTER_GRIDSIZE, DEBOUNCE_VALUE } from '../../utils/consts';
import { Feature } from '@yandex/ymaps3-types/packages/clusterer';
import { useMapContext } from '../../utils/hooks/useMap/useMap';

export default function YandexMap() {
    type ExpandedFeature = Feature & { id: string };
    const [zoom, setZoom] = useState<number>(12);
    const [activePlaceId, setActivePlaceId] = useState<number | null>(null);
    const navigate = useNavigate();
    const { restaurantsFiltered, inView, setLastClickedRestaurantId, setBounds, userLocation, setUserLocation } = useRestaurantsContext();
    const { setCity, location, setLocation, isDrawerOpen, mapBottomMargin, setMapBottomMargin } = useMapContext();

    const handleMapUpdate = useCallback((): MapEventUpdateHandler => {
        return debounce(function (object) {
            if (object.mapInAction) return;
            setZoom(object.location.zoom);
            const boundsCoords = object.location.bounds;
            setBounds(boundsCoords);
        }, DEBOUNCE_VALUE);
    }, [setBounds]);

    const onActionStartHandler = useCallback((): BehaviorMapEventHandler => {
        return function (object) {
            if (object.type === 'dblClick') return;
            setMapBottomMargin(40);
        };
    }, []);

    const handlePlacemarkClick = useCallback(
        (placeId: number, longitude: number, latitude: number) => {
            setMapBottomMargin(isDrawerOpen ? 460 : 40);
            setLastClickedRestaurantId(placeId);
            setLocation({ ...location, center: [longitude, latitude] });
            navigate(`/restaurants/${placeId}`);
        },
        [navigate, setLastClickedRestaurantId, location, isDrawerOpen, setLocation, setMapBottomMargin]
    );

    const points: ExpandedFeature[] = restaurantsFiltered.map((restaurant) => ({
        type: 'Feature',
        id: restaurant.id.toString(),
        geometry: { coordinates: [restaurant.coordinates.longitude, restaurant.coordinates.latitude], type: 'Point' },
        properties: { name: restaurant.name },
    }));

    const mapMarker = useCallback(
        (place: ExpandedFeature) => {
            const id = parseInt(place.id);
            const active = activePlaceId === id;
            return (
                <YMapMarker key={place.id} coordinates={place.geometry.coordinates} draggable={false} onClick={() => handlePlacemarkClick(id, place.geometry.coordinates[0], place.geometry.coordinates[1])} zIndex={active ? 10 : 0}>
                    <div className={styles.yamap__marker_container}>
                        <img className={`${styles.yamap__marker} ${active ? styles.yamap__marker_active : ''}`} src={active ? markerActive : marker}></img>
                        <span className={styles.yamap__marker_name}>{place.properties?.name as string}</span>
                    </div>
                </YMapMarker>
            );
        },
        [activePlaceId, handlePlacemarkClick]
    );

    const onClusterClick = useCallback(
        (coordinates: LngLat) => {
            setMapBottomMargin(isDrawerOpen ? 460 : 40);
            setLocation({ ...location, center: coordinates, zoom: zoom < 12 ? 12 : zoom + 1 });
            setZoom((zoom) => (zoom < 12 ? 12 : zoom + 1));
        },
        [location, zoom, isDrawerOpen, setLocation, setMapBottomMargin]
    );

    const cluster = useCallback(
        (coordinates: LngLat, features: ExpandedFeature[]) => {
            return (
                <YMapMarker coordinates={coordinates}>
                    <div className={styles.yamap__cluster} onClick={() => onClusterClick(coordinates)}>
                        <div className={styles.yamap__cluster_content}>
                            <span className={styles.yamap__cluster_text}>{features.length}</span>
                        </div>
                    </div>
                </YMapMarker>
            );
        },
        [onClusterClick]
    );

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.longitude, position.coords.latitude]);
                setLocation((location) => {
                    return { ...location, center: [position.coords.longitude, position.coords.latitude] };
                });
            });
        }
    }, [setUserLocation, setLocation]);

    useEffect(() => {
        if (inView && activePlaceId !== inView) {
            setActivePlaceId(inView);
            const place = restaurantsFiltered.find((place) => place.id === inView);
            if (place) {
                setMapBottomMargin(460);
                setLocation((location) => {
                    return { ...location, center: [place.coordinates.longitude, place.coordinates.latitude], zoom: zoom };
                });
            }
        }
    }, [inView, restaurantsFiltered, activePlaceId, zoom, setLocation, setMapBottomMargin]);

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
            <YMap location={location} margin={[100, 10, mapBottomMargin, 10]} showScaleInCopyrights={true}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapListener onActionStart={useMemo(() => onActionStartHandler(), [onActionStartHandler])} onUpdate={useMemo(() => handleMapUpdate(), [handleMapUpdate])} />
                <YMapClusterer
                    marker={mapMarker}
                    cluster={cluster}
                    // @ts-expect-error clusterByGrid typed as Context<unknown> instead of type declared in clusterByGrid.d.ts which results in "Type 'Context<unknown>' has no call signatures" error. Possibly a bug in @yandex/ymaps3-clusterer@0.0.1
                    method={useMemo(() => clusterByGrid({ gridSize: CLUSTER_GRIDSIZE }), [])}
                    features={points}
                />
                {userLocation && (
                    <YMapMarker key={userLocation[0]} coordinates={userLocation} draggable={false}>
                        <img className={styles.yamap__marker} src={userMarker} />
                    </YMapMarker>
                )}
            </YMap>
        </div>
    );
}
