import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useState } from 'react';
import { YMapLocationRequest } from '@yandex/ymaps3-types';
import { COMMON_LOCATION_PARAMS, INITIAL_CENTER, INITIAL_ZOOM } from '../utils/consts';

type MapContext = {
    city: string;
    setCity: Dispatch<SetStateAction<string>>;
    location: YMapLocationRequest;
    setLocation: Dispatch<SetStateAction<YMapLocationRequest>>;
};

export const MapContext = createContext<MapContext>({
    city: '',
    setCity: () => {},
    location: {},
    setLocation: () => {},
});

export const MapProvider: FC<PropsWithChildren> = ({ children }) => {
    const [city, setCity] = useState<string>('');
    const [location, setLocation] = useState<YMapLocationRequest>({
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        ...COMMON_LOCATION_PARAMS,
    });

    return (
        <MapContext.Provider
            value={{
                city,
                setCity,
                location,
                setLocation,
            }}
        >
            {children}
        </MapContext.Provider>
    );
};
