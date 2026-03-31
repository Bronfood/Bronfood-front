import { basePaymentRequest } from './BasePayment';
import { PaymentRequest, PaymentResponse, PaymentService } from './paymentService';

export class PaymentServiceReal implements PaymentService {
    private paymentRequest: PaymentRequest = basePaymentRequest;

    async getPaymentToken({ amount, description }: { amount: number; description: string }): Promise<PaymentResponse> {
        const encodedData = window.btoa(`${import.meta.env.VITE_SHOP_ID}:${import.meta.env.VITE_SHOP_SECRET}`);
        const headers: RequestInit['headers'] = {
            Authorization: `Basic ${encodedData}`,
            'Content-Type': 'application/json;charset=utf-8',
            Accept: 'application/json',
            'X-API-Version': '2',
        };
        const options: RequestInit = {
            method: 'POST',
            headers: {
                ...headers,
            },
        };
        options.body = JSON.stringify({
            checkout: {
                ...this.paymentRequest,
                order: {
                    currency: this.paymentRequest.order.currency,
                    amount,
                    description,
                    tracking_id: amount.toString(),
                },
            },
        });
        try {
            const res = await fetch(`https://checkout.paylink.kz/ctp/api/checkouts`, options);
            const result = await res.json();
            if (res.ok) {
                return result;
            } else {
                throw new Error('Error');
            }
        } catch (error) {
            if (error instanceof TypeError) {
                throw new Error('checkYourInternetConnection');
            }
            throw error;
        }
    }
}
