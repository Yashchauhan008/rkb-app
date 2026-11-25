/** Shapes returned by the RKB backend (read-only contract; the backend is never modified). */

export interface ApiStore {
    id: string;
    name: string;
    address?: string | null;
    is_manufacture_unit: boolean;
    is_retailer_store: boolean;
    parent_store_id?: string | null;
    has_permission: boolean;
}

export interface ApiCategory {
    id: string;
    name: string;
}

export interface ApiProductImage {
    id: string;
    image: string;
    is_primary: boolean;
}

export interface ApiProduct {
    id: string;
    name: string;
    code?: string | null;
    description?: string | null;
    price: number | string | null;
    stock?: number | string | null;
    total_stock?: number | string | null;
    category?: { id: string | null; name: string | null } | null;
    images?: ApiProductImage[] | null;
    design_image?: string | null;
    created_at?: string;
    is_raw_product?: boolean;
}

export type ApiOrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export interface ApiParty {
    id: string;
    name: string;
    phone_number?: string | null;
    type?: string;
}

/** Row from GET /stores/:id/orders */
export interface ApiOrderRow {
    id: string;
    serial_number: number;
    type: string;
    status: ApiOrderStatus;
    sub_total: number | string;
    total: number | string;
    discount?: number | string;
    remark?: string | null;
    date?: string | null;
    created_at: string;
    party?: ApiParty | null;
}

/** Row from GET /stores/:id/transactions (sale bills) */
export interface ApiBillRow {
    id: string;
    serial_number: number;
    type: string;
    sub_total: number | string;
    total: number | string;
    remark?: string | null;
    date?: string | null;
    created_at: string;
    cancelled?: boolean;
    verified?: boolean;
    party?: ApiParty | null;
}

export interface ApiLineItem {
    id: string;
    name: string;
    code?: string | null;
    price: number | string;
    quantity: number | string;
    total?: number | string;
}

export interface ApiOrderDetail {
    id: string;
    store_id: string;
    serial_number: number;
    status?: ApiOrderStatus;
    type: string;
    sub_total: number | string;
    discount?: number | string;
    tax?: number | string;
    total: number | string;
    remark?: string | null;
    date?: string | null;
    created_at: string;
    party?: ApiParty | null;
    products: ApiLineItem[] | null;
}

/** Row from GET /stores/:id/all-transactions */
export interface ApiLedgerRow {
    id: string;
    _type: 'account_transaction' | 'transaction';
    serial_number?: number | null;
    type: 'credit' | 'debit';
    category: string;
    date: string;
    amount: number | string;
    description?: string | null;
    account?: { id: string; name: string } | null;
}
