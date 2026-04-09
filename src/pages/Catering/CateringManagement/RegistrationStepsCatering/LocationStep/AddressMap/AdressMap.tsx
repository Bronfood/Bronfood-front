import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } from '../../../../../../lib/ymaps';
import { LngLat } from '@yandex/ymaps3-types';
import marker from '../../../../../../vendor/images/icons/navigation_active.png';
import styles from './AddressMap.module.scss';

interface AddressMapProps {
    coordinates: LngLat;
    zoom?: number;
    onDragEnd: (coordinates: LngLat) => void;
}

function AddressMap({ coordinates = [76.921552, 43.246345], zoom = 12, onDragEnd }: AddressMapProps) {
    return (
        <div className={styles.yamap}>
            <YMap location={{ center: coordinates, zoom }}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapMarker coordinates={coordinates} draggable={true} onDragEnd={onDragEnd}>
                    <img className={styles.yamap__marker} src={marker} />
                </YMapMarker>
            </YMap>
        </div>
    );
}

export default AddressMap;
