import { City, MapService } from './mapService';
import { handleFetch } from '../../serviceFuncs/handleFetch';

export class MapServiceReal implements MapService {
    async getCities(): Promise<{ data: City[] }> {
        return handleFetch(`api/map/cities/`);
    }
}
