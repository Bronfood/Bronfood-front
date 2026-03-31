import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { paymentService } from '../../api/paymentService/paymentService';

export const usePaymentMutations = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const getPaymentToken = useMutation({
        mutationFn: (variables: { amount: number; description: string }) => paymentService.getPaymentToken(variables),
        onError: (error) => {
            setErrorMessage(error.message);
        },
    });
    return {
        getPaymentToken,
        errorMessage,
    };
};
