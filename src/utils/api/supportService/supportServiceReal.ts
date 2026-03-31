import { handleFormDataFetch } from '../../serviceFuncs/handleFormDataFetch';
import { Support, SupportService } from './supportService';

export class SupportServiceReal implements SupportService {
    async addSupportRequest(data: FormData): Promise<{ data: Support }> {
        return handleFormDataFetch(`api/support/help/`, { method: 'POST', data: data });
    }
}
