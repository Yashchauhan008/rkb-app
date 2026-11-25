import { useQuery } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { listStores } from '@/src/services/api/catalog';
import type { ApiStore } from '@/src/types/api';
import { useUser } from './UserContext';

interface StoreContextType {
    /** Stores the user may access (backend already filters by role). */
    stores: ApiStore[];
    activeStore: ApiStore | null;
    activeStoreId: string | null;
    setActiveStoreId: (id: string) => void;
    isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useUser();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['stores', user?.id],
        queryFn: listStores,
        enabled: isAuthenticated,
    });

    const stores = useMemo(() => (data ?? []).filter((s) => s.has_permission), [data]);

    // Default store: the operator's assigned retailer / unit store, else the main company store.
    const defaultId = useMemo(() => {
        const preferred = user?.assigned_retailer_store_id || user?.assigned_unit_store_id;
        if (preferred && stores.some((s) => s.id === preferred)) return preferred;
        const company = stores.find((s) => !s.is_manufacture_unit && !s.is_retailer_store);
        return (company ?? stores[0])?.id ?? null;
    }, [stores, user]);

    // Reset selection on user change / logout.
    useEffect(() => {
        setSelectedId(null);
    }, [user?.id]);

    const activeStoreId = selectedId && stores.some((s) => s.id === selectedId) ? selectedId : defaultId;
    const activeStore = stores.find((s) => s.id === activeStoreId) ?? null;

    const value = useMemo(
        () => ({ stores, activeStore, activeStoreId, setActiveStoreId: setSelectedId, isLoading }),
        [stores, activeStore, activeStoreId, isLoading],
    );

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextType {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be used within a StoreProvider');
    return ctx;
}
