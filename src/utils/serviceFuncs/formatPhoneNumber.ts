import { format } from '@react-input/mask';
import { MASKPHONE, REPLACEMENT } from '../consts';

export const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
        return '+7' + digits.slice(1);
    }
    return '+' + digits;
};

export const normalizePhone = (value?: string): string => {
    const digits = (value ?? '').replace(/\D/g, '');
    return digits ? `+${digits}` : '';
};

export const formatPhoneForDisplay = (phone?: string): string => {
    if (!phone) return '';
    const digits = formatPhoneNumber(phone).replace(/\D/g, '');
    return format(digits, { mask: MASKPHONE, replacement: REPLACEMENT });
};

export const toPhoneSearchQuery = (value?: string): string => {
    const digits = (value ?? '').replace(/\D/g, '');
    if (!digits) return '';
    return digits.startsWith('8') ? `+7${digits.slice(1)}` : `+${digits}`;
};
