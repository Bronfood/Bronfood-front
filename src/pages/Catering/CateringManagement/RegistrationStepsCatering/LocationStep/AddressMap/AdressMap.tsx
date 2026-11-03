import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } from '../../../../../../lib/ymaps';
import { LngLat } from '@yandex/ymaps3-types';
import marker from '../../../../../../vendor/images/icons/navigation_active.png';
import styles from './AddressMap.module.scss';
import { INITIAL_CENTER } from '../../../../../../utils/consts';
interface AddressMapProps {
    coordinates: LngLat;
    zoom?: number;
    onDragEnd: (coordinates: LngLat) => void;
}

function AddressMap({ coordinates = INITIAL_CENTER, zoom = 12, onDragEnd }: AddressMapProps) {
    return (
        <div className={styles.yamap}>
            <YMap location={{ center: coordinates, zoom }}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapMarker
                    coordinates={coordinates}
                    draggable={true}
                    onDragEnd={(e: LngLat) => {
                        const eventObj = e as unknown as { coordinates?: LngLat; position?: LngLat };
                        const newCoords = eventObj.coordinates || eventObj.position || e;

                        onDragEnd(newCoords);
                    }}
                >
                    <img className={styles.yamap__marker} src={marker} />
                </YMapMarker>
            </YMap>
        </div>
    );
}

export default AddressMap;
