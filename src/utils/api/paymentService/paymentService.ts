import { PaymentServiceReal } from './paymentServiceReal';

type CustomerFields = Array<'email' | 'first_name' | 'last_name' | 'address' | 'city' | 'state' | 'zip' | 'phone' | 'country' | 'birth_date' | 'taxpayer_id'>;

export type PaymentRequest = {
    test: boolean;
    transaction_type: 'payment' | 'authorization' | 'tokenization' | 'charge';
    attempts: number;
    settings: {
        success_url: string;
        fail_url: string;
        button_text?: string;
        button_next_text: string;
        language: 'ru' | 'en' | 'kk';
        customer_fields?: {
            visible: CustomerFields;
            read_only: CustomerFields;
        };
        credit_card_fields?: {
            holder: string;
            read_only: ['holder'];
        };
    };
    payment_method?: {
        types: ['credit_card', 'bank_transfer'];
        bank_transfer: {
            account: 'DE89370400440532013000';
        };
        excluded_brands: ['visa', 'google_pay'];
    };
    order: {
        currency: 'KZT';
        amount: number;
        description: string;
        tracking_id?: string;
        expired_at?: string;
    };
    customer?: {
        address: string;
        country: string;
        city: string;
        email: string;
    };
};

export type PaymentResponse = {
    checkout: {
        token: string;
        redirect_url: string;
    };
};

export interface PaymentService {
    getPaymentToken: ({ amount, description }: { amount: number; description: string }) => Promise<PaymentResponse>;
}

export const paymentService = new PaymentServiceReal();
