import type { ApiCategory, ApiOrderDetail, ApiOrderRow, ApiBillRow, ApiLedgerRow, ApiProduct, ApiStore } from '@/src/types/api';
import axios from './httpRequest';

const get = <T>(url: string, params?: Record<string, unknown>) =>
    axios({ method: 'GET', url, params }) as unknown as Promise<T>;

export const listStores = () => get<ApiStore[]>('/stores');

export const listCategories = () => get<ApiCategory[]>('/product-categories');

export interface ListProductsParams {
    store_id: string;
    offset?: number;
    limit?: number;
    search?: string;
    category_id?: string | null;
    in_stock?: boolean;
}

export const listProducts = ({ category_id, search, ...rest }: ListProductsParams) =>
    get<ApiProduct[]>('/products', {
        ...rest,
        // finished goods only; raw materials / castings are internal
        is_raw_product: false,
        is_casting_product: false,
        ...(search ? { search } : {}),
        ...(category_id ? { category_id } : {}),
    });

export const getProduct = (productId: string, storeId: string) =>
    get<ApiProduct>(`/products/${productId}`, { store_id: storeId });

export const listOrders = (storeId: string, params: { offset?: number; limit?: number; status?: string; search?: string }) =>
    get<ApiOrderRow[]>(`/stores/${storeId}/orders`, params);

export const getOrder = (orderId: string) => get<ApiOrderDetail>(`/orders/${orderId}`);

/** Sale bills (used when the user has transaction.read but not order.read). */
export const listBills = (storeId: string, params: { offset?: number; limit?: number; search?: string }) =>
    get<ApiBillRow[]>(`/stores/${storeId}/transactions`, { ...params, type: 'sale', transfer_filter: 'bills' });

export const getBill = (transactionId: string) => get<ApiOrderDetail>(`/transactions/${transactionId}`);

export const listLedger = (storeId: string, params: { offset?: number; limit?: number; type?: 'credit' | 'debit' }) =>
    get<ApiLedgerRow[]>(`/stores/${storeId}/all-transactions`, params);
