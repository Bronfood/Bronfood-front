import { MapServiceReal } from './mapServiceReal';

export type City = {
    id: number;
    name: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
};

export interface MapService {
    getCities: () => Promise<{ data: City[] }>;
}

export const mapService = new MapServiceReal();
