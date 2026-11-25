import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useStore } from '@/src/context/StoreContext';
import { useUser } from '@/src/context/UserContext';
import { getBill, getOrder, listBills, listLedger, listOrders } from '@/src/services/api/catalog';
import type { ApiLedgerRow, ApiOrderDetail } from '@/src/types/api';
import { num } from '@/src/utils/files';

const PAGE_SIZE = 30;

export type OrderSource = 'order' | 'bill';

export interface OrderSummaryRow {
    id: string;
    source: OrderSource;
    number: string;
    status: string;
    date: string;
    total: number;
    partyName: string;
    remark: string;
}

/** Orders need order.read; otherwise fall back to sale bills (transaction.read). */
export function useOrderSource(): OrderSource | null {
    const { activeStoreId } = useStore();
    const { can } = useUser();
    if (!activeStoreId) return null;
    if (can(activeStoreId, 'order.read')) return 'order';
    if (can(activeStoreId, 'transaction.read')) return 'bill';
    return null;
}

export function useOrdersList(filters: { status?: string; search?: string }) {
    const { activeStoreId } = useStore();
    const source = useOrderSource();

    const query = useInfiniteQuery({
        queryKey: ['orders', source, activeStoreId, filters.status, filters.search],
        enabled: !!activeStoreId && !!source,
        initialPageParam: 0,
        queryFn: async ({ pageParam }): Promise<OrderSummaryRow[]> => {
            const base = { offset: pageParam, limit: PAGE_SIZE, ...(filters.search ? { search: filters.search } : {}) };
            if (source === 'order') {
                const rows = await listOrders(activeStoreId as string, { ...base, ...(filters.status ? { status: filters.status } : {}) });
                return rows.map((o) => ({
                    id: o.id,
                    source: 'order',
                    number: String(o.serial_number),
                    status: o.status,
                    date: o.date ?? o.created_at,
                    total: num(o.total),
                    partyName: o.party?.name ?? '',
                    remark: o.remark ?? '',
                }));
            }
            const rows = await listBills(activeStoreId as string, base);
            return rows.map((b) => ({
                id: b.id,
                source: 'bill',
                number: String(b.serial_number),
                status: b.cancelled ? 'cancelled' : b.verified ? 'completed' : 'pending',
                date: b.date ?? b.created_at,
                total: num(b.total),
                partyName: b.party?.name ?? '',
                remark: b.remark ?? '',
            }));
        },
        getNextPageParam: (last, all) => (last.length < PAGE_SIZE ? undefined : all.length * PAGE_SIZE),
    });

    const orders = useMemo(() => (query.data?.pages ?? []).flat(), [query.data]);
    return { ...query, orders, source };
}

export function useOrderDetail(id: string | undefined, source: OrderSource) {
    return useQuery<ApiOrderDetail>({
        queryKey: ['order', source, id],
        enabled: !!id,
        queryFn: () => (source === 'order' ? getOrder(id as string) : getBill(id as string)),
    });
}

export interface LedgerEntryRow {
    id: string;
    date: string;
    description: string;
    type: 'debit' | 'credit';
    amount: number;
    referenceNumber: string;
    category: string;
}

export function useLedger() {
    const { activeStoreId } = useStore();
    const { can } = useUser();
    const allowed = !!activeStoreId && can(activeStoreId, 'accounts.read');

    const query = useInfiniteQuery({
        queryKey: ['ledger', activeStoreId],
        enabled: allowed,
        initialPageParam: 0,
        queryFn: ({ pageParam }) => listLedger(activeStoreId as string, { offset: pageParam, limit: PAGE_SIZE }),
        getNextPageParam: (last, all) => (last.length < PAGE_SIZE ? undefined : all.length * PAGE_SIZE),
    });

    const entries = useMemo<LedgerEntryRow[]>(
        () =>
            (query.data?.pages ?? []).flat().map((r: ApiLedgerRow) => ({
                id: `${r._type}-${r.id}`,
                date: r.date,
                description: r.description || (r.account?.name ?? r.category.replace(/_/g, ' ')),
                type: r.type,
                amount: num(r.amount),
                referenceNumber: r.serial_number ? `#${r.serial_number}` : '',
                category: r.category,
            })),
        [query.data],
    );
    return { ...query, entries };
}
