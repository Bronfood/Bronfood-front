import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useMemo, useState } from 'react';
import { YMapLocationRequest } from '@yandex/ymaps3-types';
import { COMMON_LOCATION_PARAMS, INITIAL_CENTER, INITIAL_ZOOM } from '../utils/consts';

type MapContext = {
    city: string;
    setCity: Dispatch<SetStateAction<string>>;
    location: YMapLocationRequest;
    setLocation: Dispatch<SetStateAction<YMapLocationRequest>>;
    isDrawerOpen: boolean;
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
    mapBottomMargin: number;
    setMapBottomMargin: Dispatch<SetStateAction<number>>;
};

export const MapContext = createContext<MapContext>({
    city: '',
    setCity: () => {},
    location: {},
    setLocation: () => {},
    isDrawerOpen: true,
    setIsDrawerOpen: () => {},
    mapBottomMargin: 460,
    setMapBottomMargin: () => {},
});

export const MapProvider: FC<PropsWithChildren> = ({ children }) => {
    const [city, setCity] = useState<string>('');
    const [location, setLocation] = useState<YMapLocationRequest>({
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        ...COMMON_LOCATION_PARAMS,
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
    const [mapBottomMargin, setMapBottomMargin] = useState(isDrawerOpen ? 460 : 40);

    const contextValue = useMemo(
        () => ({
            city,
            setCity,
            location,
            setLocation,
            isDrawerOpen,
            setIsDrawerOpen,
            mapBottomMargin,
            setMapBottomMargin,
        }),
        [city, setCity, location, setLocation, isDrawerOpen, setIsDrawerOpen, mapBottomMargin, setMapBottomMargin]
    );
    return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>;
};
