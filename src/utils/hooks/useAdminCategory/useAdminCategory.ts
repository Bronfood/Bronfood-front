import { useQuery } from '@tanstack/react-query';
import { adminServiceMock } from '../../api/adminService/adminService';

export const useGetAdminCategory = () => {
    return useQuery({
        queryKey: ['adminCategory'],
        queryFn: () => adminServiceMock.getAdminCategory(),
    });
};
