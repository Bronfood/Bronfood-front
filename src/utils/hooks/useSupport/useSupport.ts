import { useMutation } from '@tanstack/react-query';
import { supportService } from '../../api/supportService/supportService';

export const useSupport = () => {
    return useMutation({
        mutationFn: (data: FormData) => supportService.addSupportRequest(data),
    });
};
