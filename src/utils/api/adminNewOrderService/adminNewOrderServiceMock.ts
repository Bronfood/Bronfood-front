import { Category } from '../categoryService/categoryService';
import { MockAdminNewOrderService } from './adminNewOrderService';
import { categories } from './MockAdminNewOrderService';

export class AdminNewOrderServiceMock implements MockAdminNewOrderService {
    private categories: Category[] = categories;

    async getAdminCategory(): Promise<{ data: Category[] }> {
        return await Promise.resolve({ data: this.categories });
    }
}
