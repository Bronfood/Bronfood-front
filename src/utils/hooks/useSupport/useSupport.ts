import { useMutation } from '@tanstack/react-query';
import { Support, supportService } from '../../api/supportService/supportService';

export const useSupport = () => {
    return useMutation({
        mutationFn: (data: Omit<Support, 'id' | 'created_at' | 'status'>) => supportService.addSupportRequest(data),
    });
};
