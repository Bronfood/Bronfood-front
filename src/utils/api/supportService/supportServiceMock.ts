import { Support, SupportService } from './supportService';

export class SupportServiceMock implements SupportService {
    async _wait(ms: number) {
        return new Promise((res) => setTimeout(res, ms));
    }

    async addSupportRequest(supportData: Omit<Support, 'id'>): Promise<{ data: Support }> {
        await this._wait(1000);

        const success = Math.random() > 0.2;
        if (success) {
            const result = await Promise.resolve({
                data: {
                    ...supportData,
                    id: Math.random(),
                    created_at: new Date().toISOString(),
                    images: supportData.images || [],
                    status: 'created',
                },
            });

            return result;
        } else {
            return await Promise.reject(new Error('Произошла ошибка'));
        }
    }
}
