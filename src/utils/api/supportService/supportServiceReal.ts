import { handleFetch } from '../../serviceFuncs/handleFetch';
import { Support, SupportService } from './supportService';

export class SupportServiceReal implements SupportService {
    async addSupportRequest(data: FormData): Promise<{ data: Support }> {
        return handleFetch(`api/support/help/`, { method: 'POST', data: data });
    }
}
