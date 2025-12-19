import { City, MapService } from './mapService';

export class MapServiceMock implements MapService {
    async _wait(ms: number) {
        return new Promise((res) => setTimeout(res, ms));
    }
    async getCities(): Promise<{ data: City[] }> {
        await this._wait(1000);
        const cities: City[] = [
            {
                id: 1,
                name: 'Алматы',
                coordinates: {
                    latitude: 43.239491,
                    longitude: 76.945435,
                },
            },
            {
                id: 2,
                name: 'Астана',
                coordinates: {
                    latitude: 51.129947,
                    longitude: 71.430053,
                },
            },
        ];
        const success = true;
        if (success) {
            return await Promise.resolve({ data: cities });
        } else {
            return await Promise.reject(new Error('Произошла ошибка'));
        }
    }
}
