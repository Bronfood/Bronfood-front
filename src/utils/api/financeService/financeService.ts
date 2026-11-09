import { FinanceServiceMock } from './financeServiceMock';

export type PaymentRequisitesCard = {
    id: number;
    number_card: number;
    default: boolean;
    payment_system: string;
    username: string;
    date: string;
    CVV: number;
    is_save: boolean;
};

export type Wallet = {
    balance: number;
    caterings: number;
    debit_day: number;
    debit_monthly: number;
    payment_date: string;
};

export type PayoutRequisitesCatering = {
    recipient_type: 'IP' | 'TOO';
    tax_id: string;
    bank_name: string;
    iban: string;
    bic: string;
};

export type PayloadPaymentRequisitesCard = Omit<PayoutRequisitesCatering, 'bank_name'>;

export interface FinanceService {
    getPayoutRequisites: () => Promise<{ data: PayoutRequisitesCatering }>;
    updatePayoutRequisites: (data: PayloadPaymentRequisitesCard) => Promise<{ data: PayoutRequisitesCatering }>;

    getWallet: () => Promise<{ data: Wallet }>;
    refillWallet: (payload: number) => Promise<{ data: Wallet }>;

    getPaymentRequisitesCards: () => Promise<{ data: PaymentRequisitesCard[] }>;
    getPaymentRequisitesCardById: (requisitesCardId: number) => Promise<{ data: PaymentRequisitesCard }>;
    deletePaymentRequisitesCard: (requisitesCardId: number) => Promise<{ success: boolean }>;
}

export const financeService = new FinanceServiceMock();
