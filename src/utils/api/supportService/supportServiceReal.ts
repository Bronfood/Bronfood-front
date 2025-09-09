import { handleFetch } from '../../serviceFuncs/handleFetch';
import { Partnership, SupportService } from './supportService';

export class SupportServiceReal implements SupportService {
    async addPartnership(partnershipData: Partnership): Promise<{ data: Partnership }> {
        return handleFetch(`api/support/partnership/`, { method: 'POST', data: partnershipData });
    }
}
