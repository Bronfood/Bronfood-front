import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/adminService/adminService';
import { useState } from 'react';

export const useGetAdminSchedules = (start: Date, end: Date) => {
    return useQuery({
        queryKey: ['adminSchedules', start, end],
        queryFn: () => adminService.getAdminSchedules(start, end),
    });
};

export const useAdminScheduleMutations = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const queryClient = useQueryClient();
    const addSchedule = useMutation({
        mutationFn: ({ date, openTime, closeTime }: { date: Date; openTime: string | null; closeTime: string | null }) => adminService.addSchedule(date, openTime, closeTime),
        onSuccess: () =>
            queryClient.refetchQueries({
                queryKey: ['adminSchedules'],
                type: 'active',
            }),
        onError: (error) => {
            setErrorMessage(error.message);
        },
    });
    return {
        addSchedule,
        errorMessage,
    };
};
