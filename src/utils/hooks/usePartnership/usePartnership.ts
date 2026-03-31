import { useMutation } from '@tanstack/react-query';
import { Partnership, partnershipService } from '../../api/partnershipService/partnershipService';

export const usePartnership = () => {
    return useMutation({
        mutationFn: (data: Partnership) => partnershipService.addPartnership(data),
    });
};
