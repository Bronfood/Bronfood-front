import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/adminService/adminService';

export const useGetAdminSchedules = (start: Date, end: Date) => {
    return useQuery({
        queryKey: ['adminSchedules', start, end],
        queryFn: () => adminService.getAdminSchedules(start, end),
    });
};

export const useAdminScheduleMutations = () => {
    const queryClient = useQueryClient();
    const addSchedule = useMutation({
        mutationFn: ({ date, openTime, closeTime }: { date: Date | undefined; openTime: string | null; closeTime: string | null }) => adminService.addSchedule(date, openTime, closeTime),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['adminSchedules'],
            });
        },
    });
    return {
        addSchedule,
    };
};
