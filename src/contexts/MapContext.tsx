import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useMemo, useState } from 'react';
import { EasingFunctionDescription, LngLat } from '@yandex/ymaps3-types';
import { COMMON_LOCATION_PARAMS, INITIAL_CENTER, ZOOM } from '../utils/consts';
import { useCities } from '../utils/hooks/useCities/useCities';
import { City } from '../utils/api/mapService/mapService';

type Location = {
    center: LngLat;
    zoom: number;
    easing: EasingFunctionDescription;
    duration: number;
};

type MapContext = {
    location: Location;
    setLocation: Dispatch<SetStateAction<Location>>;
    isDrawerOpen: boolean;
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
    mapBottomMargin: number;
    setMapBottomMargin: Dispatch<SetStateAction<number>>;
    cities: City[];
};

export const MapContext = createContext<MapContext>({
    location: { center: INITIAL_CENTER, zoom: ZOOM, ...COMMON_LOCATION_PARAMS },
    setLocation: () => {},
    isDrawerOpen: true,
    setIsDrawerOpen: () => {},
    mapBottomMargin: 460,
    setMapBottomMargin: () => {},
    cities: [],
});

export const MapProvider: FC<PropsWithChildren> = ({ children }) => {
    const [location, setLocation] = useState<Location>({
        center: INITIAL_CENTER,
        zoom: ZOOM,
        ...COMMON_LOCATION_PARAMS,
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
    const [mapBottomMargin, setMapBottomMargin] = useState(isDrawerOpen ? 460 : 40);
    const { data, isSuccess } = useCities();
    const cities = useMemo(() => (isSuccess ? data.data : []), [isSuccess, data?.data]);

    const contextValue = useMemo(
        () => ({
            location,
            setLocation,
            isDrawerOpen,
            setIsDrawerOpen,
            mapBottomMargin,
            setMapBottomMargin,
            cities,
        }),
        [location, setLocation, isDrawerOpen, setIsDrawerOpen, mapBottomMargin, setMapBottomMargin, cities]
    );
    return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>;
};
