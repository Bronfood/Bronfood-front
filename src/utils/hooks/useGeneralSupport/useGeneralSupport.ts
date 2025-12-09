import { useMutation } from '@tanstack/react-query';
import { GeneralSupport, supportService } from '../../api/supportService/supportService';

export const useGeneralSupport = () => {
    return useMutation({
        mutationFn: (data: Omit<GeneralSupport, 'id'>) => supportService.addGeneralSupportRequest(data),
    });
};
