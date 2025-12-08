import { FC, PropsWithChildren, createContext, useCallback, useState, Dispatch, SetStateAction, useMemo } from 'react';
import { Restaurant, SearchSuggestion } from '../utils/api/restaurantsService/restaurantsService';
import { LngLat, LngLatBounds } from '@yandex/ymaps3-types';
import { useRestaurants } from '../utils/hooks/useRestaurants/useRestaurants';
import { useSearchSuggestions } from '../utils/hooks/useSearchSuggestions/useSearchSuggestions';
import { INITIAL_BOUNDS, types } from '../utils/consts';

export type VenueType = {
    /**
     * Type's id.
     */
    id: number;
    /**
     * Type of venue. Not to be confused with venue's name
     */
    name: string;
};

export type RestaurantsContext = {
    /**
     * Reload data restaurants
     */
    refetch: () => void;
    /**
     * Sets clicked restaurant page
     */
    setActiveRestaurant: (id: number) => void;
    /**
     * Restaurant which is clicked in a list
     */
    inView?: number;
    /**
     * List of restaurants filtered with user selected options
     */
    restaurantsFiltered: Restaurant[];
    /**
     * Indicates whether restaurants are loading
     */
    isLoading: boolean;
    /**
     * Indicates whether query encountered an error
     */
    isError: boolean;
    /**
     * Sets restaurant which is clicked in a list
     */
    setInView: (id: number) => void;
    /**
     * Restaurant which is last clicked in a list
     */
    lastClickedRestaurantId: number | null;
    /**
     * Sets restaurant which is last clicked in a list
     */
    setLastClickedRestaurantId: (id: number | null) => void;
    /**
     * Options' states and controls. Options come from user's input
     */
    options: {
        /**
         * List of options selected by user
         */
        selectedOptions: SearchSuggestion[];
        /**
         * Add option to the list of selected options
         */
        addOption: (option: SearchSuggestion) => void;
        /**
         * Remove option from the list of selected options
         */
        deleteOption: (option: SearchSuggestion) => void;
    };
    /**
     * Types of venues states and control
     */
    venueTypes: {
        /**
         * All types of venues found on map
         */
        all: VenueType[];
        /**
         * List of venue types selected by user
         */
        selectedVenueTypes: VenueType[];
        /**
         * Add venue type to the list of selected venue types
         */
        addVenueType: (type: VenueType) => void;
        /**
         * Remove venue type from the list of selected venue types
         */
        deleteVenueType: (type: VenueType) => void;
    };
    /**
     * Sets Yandex map's bounds
     */
    setBounds: Dispatch<SetStateAction<LngLatBounds | never[]>>;
    /**
     * User's location on YandexMap
     */
    userLocation: LngLat | undefined;
    /**
     * Sets user's location on YandexMap
     */
    setUserLocation: Dispatch<SetStateAction<LngLat | undefined>>;
    /**
     * Input value
     */
    searchQuery: string;
    /**
     * Sets input value
     */
    setSearchQuery: Dispatch<SetStateAction<string>>;
    /**
     * Search suggestions on user input
     */
    searchSuggestions: SearchSuggestion[];
};

export const RestaurantsContext = createContext<RestaurantsContext>({
    setActiveRestaurant: () => {},
    restaurantsFiltered: [],
    isLoading: false,
    isError: false,
    refetch: () => {},
    setInView: () => {},
    lastClickedRestaurantId: null,
    setLastClickedRestaurantId: () => {},
    options: {
        selectedOptions: [],
        addOption: () => {},
        deleteOption: () => {},
    },
    venueTypes: {
        all: [],
        selectedVenueTypes: [],
        addVenueType: () => {},
        deleteVenueType: () => {},
    },
    setBounds: () => {},
    userLocation: undefined,
    setUserLocation: () => {},
    searchQuery: '',
    setSearchQuery: () => {},
    searchSuggestions: [],
});

export const RestaurantsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [inView, setInView] = useState<number | undefined>(undefined);
    const [lastClickedRestaurantId, setLastClickedRestaurantId] = useState<number | null>(null);
    const [bounds, setBounds] = useState<LngLatBounds | never[]>(INITIAL_BOUNDS);
    const [userLocation, setUserLocation] = useState<LngLat | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const { isSuccess: isSearchSuggestionsSuccess, data: searchSuggestionsData } = useSearchSuggestions(searchQuery);
    const searchSuggestions = useMemo(() => (isSearchSuggestionsSuccess ? searchSuggestionsData.data : []), [isSearchSuggestionsSuccess, searchSuggestionsData]);
    const [selectedOptions, setSelectedOptions] = useState<SearchSuggestion[]>([]);
    const [selectedVenueTypes, setSelectedVenueTypes] = useState<VenueType[]>([]);
    const { isLoading, isError, restaurantsOnMap: restaurantsFiltered, refetch } = useRestaurants(bounds as LngLatBounds, userLocation as LngLat, selectedOptions as SearchSuggestion[], selectedVenueTypes as VenueType[]);
    const setActiveRestaurant = useCallback((id: number) => {
        setInView(id);
    }, []);
    const addOption = useCallback(
        (option: SearchSuggestion) => {
            if (!selectedOptions.find((opt: SearchSuggestion) => opt.text === option.text)) {
                setSelectedOptions([...selectedOptions, option]);
            }
        },
        [selectedOptions]
    );
    const deleteOption = useCallback(
        (option: SearchSuggestion) => {
            setSelectedOptions(selectedOptions.filter((opt: SearchSuggestion) => opt.text !== option.text));
        },
        [selectedOptions]
    );
    const addVenueType = useCallback(
        (venueType: VenueType) => {
            if (!selectedVenueTypes.find((type: VenueType) => type.id === venueType.id)) {
                setSelectedVenueTypes([...selectedVenueTypes, venueType]);
            }
        },
        [selectedVenueTypes]
    );
    const deleteVenueType = useCallback(
        (venueType: VenueType) => {
            setSelectedVenueTypes(selectedVenueTypes.filter((type: VenueType) => type.id !== venueType.id));
        },
        [selectedVenueTypes]
    );

    const contextValue = useMemo(
        () => ({
            isLoading,
            isError,
            setActiveRestaurant,
            restaurantsFiltered,
            refetch: refetch,
            inView,
            setInView,
            lastClickedRestaurantId,
            setLastClickedRestaurantId,
            options: {
                selectedOptions,
                addOption,
                deleteOption,
            },
            venueTypes: {
                all: types,
                selectedVenueTypes,
                addVenueType,
                deleteVenueType,
            },
            setBounds,
            userLocation,
            setUserLocation,
            searchQuery,
            setSearchQuery,
            searchSuggestions,
        }),
        [isLoading, isError, setActiveRestaurant, restaurantsFiltered, refetch, inView, setInView, lastClickedRestaurantId, setLastClickedRestaurantId, selectedOptions, addOption, deleteOption, selectedVenueTypes, addVenueType, deleteVenueType, setBounds, userLocation, setUserLocation, searchQuery, setSearchQuery, searchSuggestions]
    );

    return <RestaurantsContext.Provider value={contextValue}>{children}</RestaurantsContext.Provider>;
};
