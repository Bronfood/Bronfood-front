import { formatDate } from '../../serviceFuncs/formatDate';
import { handleFetch } from '../../serviceFuncs/handleFetch';
import { AdminOrder, AdminOrderFromApi, AdminOrderStatus, AdminService, Schedule } from './adminService';

export class AdminServiceReal implements AdminService {
    async getAdminOrders(status: AdminOrderStatus): Promise<{ data: AdminOrder[] }> {
        const result = await handleFetch(`api/restaurants/admin/orders/?status=${status}&limit=3`);
        const adminOrdersFromApi: AdminOrderFromApi[] = result.data.results;
        const returnResult: AdminOrder[] = adminOrdersFromApi.map((item) => {
            const meals = item.meals.map((oldMeal) => {
                const { meal, ...rest } = oldMeal;
                const newMeal = {
                    ...rest,
                    meal: {
                        id: meal.id,
                        name: meal.name,
                        price: meal.price,
                        waitingTime: meal.waiting_time,
                    },
                };
                return newMeal;
            });
            const issuedAt = item.issuedAt === '' ? item.issuedAt : new Date(item.issuedAt);
            const result: AdminOrder = {
                ...item,
                waitingTime: item.waiting_time,
                meals,
                issuedAt,
            };
            Reflect.deleteProperty(result, 'waiting_time');
            return result;
        });
        return { data: returnResult };
    }

    async changeAdminOrderStatus(id: number, status: AdminOrderStatus): Promise<void> {
        return handleFetch(`api/restaurants/admin/orders/${id}/${status}/`, { method: 'PATCH' });
    }

    async getAdminSchedules(start: Date, end: Date): Promise<{ data: Schedule[] }> {
        const startDate = formatDate(start);
        const endDate = formatDate(end);
        return handleFetch(`api/restaurants/admin/schedules/?start_date=${startDate}&end_date=${endDate}`);
    }

    async addSchedule(date: Date, openTime: string | null, closeTime: string | null): Promise<{ data: Schedule }> {
        const formattedDate = formatDate(date);
        return handleFetch('api/restaurants/admin/schedules/', { method: 'POST', data: { day: formattedDate, open_time: openTime, close_time: closeTime } });
    }
}
