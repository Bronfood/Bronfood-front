import { useMutation } from '@tanstack/react-query';
import { Partnership, supportService } from '../../api/supportService/supportService';

export const usePartnership = () => {
    return useMutation({
        mutationFn: (data: Partnership) => supportService.addPartnership(data),
    });
};
