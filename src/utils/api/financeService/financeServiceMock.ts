import { FinanceService, PayloadPaymentRequisitesCard, PaymentRequisitesCard, PayoutRequisitesCatering, Wallet } from './financeService';
import { requisites, cards, wallet } from './MockFinanceService';

export class FinanceServiceMock implements FinanceService {
    private requisitesData: PayoutRequisitesCatering = requisites;
    private cardsData: PaymentRequisitesCard[] = cards;
    private walletData: Wallet = wallet;

    private delay = () => new Promise((resolve) => setTimeout(resolve, 1000));

    async getPayoutRequisites(): Promise<{ data: PayoutRequisitesCatering }> {
        await this.delay();

        if (!this.requisitesData) {
            throw new Error('Requisites not found');
        }

        return { data: this.requisitesData };
    }

    async updatePayoutRequisites(data: PayloadPaymentRequisitesCard): Promise<{ data: PayoutRequisitesCatering }> {
        await this.delay();

        if (!this.requisitesData) {
            throw new Error('Requisites not found to update');
        }

        if (!data) {
            throw new Error('No data provided for update');
        }

        this.requisitesData = {
            ...this.requisitesData,
            ...data,
        };

        return { data: this.requisitesData };
    }

    async getWallet(): Promise<{ data: Wallet }> {
        await this.delay();

        if (!this.walletData) {
            throw new Error('Requisites not found');
        }

        return { data: this.walletData };
    }

    async refillWallet(payload: number): Promise<{ data: Wallet }> {
        await this.delay();

        if (!this.walletData) {
            throw new Error('Requisites not found');
        }

        if (payload <= 0) {
            throw new Error('Refill amount must be greater than zero');
        }

        this.walletData.balance += payload;

        return { data: this.walletData };
    }

    async getPaymentRequisitesCards(): Promise<{ data: PaymentRequisitesCard[] }> {
        await this.delay();

        if (!this.cardsData) {
            throw new Error('Cards data not found');
        }

        return { data: this.cardsData };
    }

    async getPaymentRequisitesCardById(requisitesCardId: number): Promise<{ data: PaymentRequisitesCard }> {
        await this.delay();

        const cardData = this.cardsData.find((card) => card.id === requisitesCardId);

        if (!cardData) {
            throw new Error('Card not found');
        }

        return { data: cardData };
    }

    async deletePaymentRequisitesCard(requisitesCardId: number): Promise<{ success: boolean }> {
        await this.delay();

        const cardData = this.cardsData.find((card) => card.id === requisitesCardId);

        if (!cardData) {
            throw new Error('Card not found');
        }

        this.cardsData = this.cardsData.filter((card) => card.id !== requisitesCardId);

        return { success: true };
    }
}
