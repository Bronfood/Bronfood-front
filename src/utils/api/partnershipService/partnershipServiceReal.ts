import { handleFetch } from '../../serviceFuncs/handleFetch';
import { Partnership, PartnershipService } from './partnershipService';

export class PartnershipServiceReal implements PartnershipService {
    async addPartnership(partnershipData: Partnership): Promise<{ data: Partnership }> {
        return handleFetch(`api/support/partnership/`, { method: 'POST', data: partnershipData });
    }
}
