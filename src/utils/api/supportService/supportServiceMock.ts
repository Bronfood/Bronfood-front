import { GeneralSupport, Partnership, MockSupportService } from './supportService';

export class SupportServiceMock implements MockSupportService {
    async _wait(ms: number) {
        return new Promise((res) => setTimeout(res, ms));
    }

    async addGeneralSupportRequest(generalSupportData: Omit<GeneralSupport, 'id'>): Promise<{ data: GeneralSupport }> {
        await this._wait(1000);

        const success = Math.random() > 0.2;
        if (success) {
            const result = await Promise.resolve({
                data: {
                    ...generalSupportData,
                    id: Math.random(),
                    created_at: new Date().toISOString(),
                    images: generalSupportData.images || [],
                    status: 'created',
                },
            });

            return result;
        } else {
            return await Promise.reject(new Error('Произошла ошибка'));
        }
    }

    async addPartnership(partnershipData: Omit<Partnership, 'id' | 'created_at' | 'status'>): Promise<{ data: Partnership }> {
        await this._wait(1000);

        const success = Math.random() > 0.2;
        if (success) {
            const result = await Promise.resolve({
                data: { ...partnershipData },
            });
            return result;
        } else {
            return await Promise.reject(new Error('Произошла ошибка'));
        }
    }
}
