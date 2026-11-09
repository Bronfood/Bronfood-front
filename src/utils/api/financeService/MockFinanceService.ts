import { PaymentRequisitesCard, PayoutRequisitesCatering, Wallet } from './financeService';

export const requisites: PayoutRequisitesCatering = {
    recipient_type: 'TOO',
    tax_id: '870505350011',
    bank_name: 'AO << Halyk Bank »',
    iban: 'KZ45 6010 0000 12345678',
    bic: 'HSBKKZKX',
};

export const cards: PaymentRequisitesCard[] = [
    { id: 1, number_card: 9136, default: true, payment_system: 'visa', username: 'Аманжолов Алькей Жуманович', date: '06/2031', CVV: 456, is_save: true },
    { id: 2, number_card: 6969, default: false, payment_system: 'mastercard', username: 'Аманжолов Алькей Жуманович', date: '12/2033', CVV: 456, is_save: true },
];

export const wallet: Wallet = {
    balance: 500,
    caterings: 3,
    debit_day: 600,
    debit_monthly: 18000,
    payment_date: '2026-06-12',
};
