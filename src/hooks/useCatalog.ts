import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useStore } from '@/src/context/StoreContext';
import type { Category, Product } from '@/src/data/types';
import { getProduct, listCategories, listProducts } from '@/src/services/api/catalog';
import type { ApiProduct } from '@/src/types/api';
import { fileUrl, num } from '@/src/utils/files';

const PAGE_SIZE = 30;

export function toProduct(p: ApiProduct): Product {
    const names = [...(p.images ?? []).map((i) => i.image), p.design_image].filter(Boolean) as string[];
    const images = Array.from(new Set(names)).map(fileUrl);
    const stock = num(p.total_stock ?? p.stock);
    return {
        id: p.id,
        name: p.name,
        price: num(p.price),
        image: images[0] ?? '',
        images,
        category: p.category?.id ?? '',
        categoryName: p.category?.name ?? undefined,
        description: p.description ?? '',
        code: p.code ?? undefined,
        inStock: stock > 0,
        stock,
        addedAt: p.created_at,
    };
}

export function useCategories() {
    const { activeStoreId } = useStore();
    return useQuery({
        queryKey: ['categories'],
        queryFn: listCategories,
        enabled: !!activeStoreId,
        select: (rows): Category[] =>
            rows.map((c) => ({ id: c.id, name: c.name, icon: '', color: '#6366F1', productCount: 0, products: [] })),
    });
}

export function useStoreProducts(filters: { search: string; categoryId: string | null }) {
    const { activeStoreId } = useStore();
    const query = useInfiniteQuery({
        queryKey: ['products', activeStoreId, filters.search, filters.categoryId],
        enabled: !!activeStoreId,
        initialPageParam: 0,
        queryFn: ({ pageParam }) =>
            listProducts({
                store_id: activeStoreId as string,
                offset: pageParam,
                limit: PAGE_SIZE,
                search: filters.search,
                category_id: filters.categoryId,
            }),
        getNextPageParam: (last, all) => (last.length < PAGE_SIZE ? undefined : all.length * PAGE_SIZE),
    });

    const products = useMemo(() => (query.data?.pages ?? []).flat().map(toProduct), [query.data]);
    return { ...query, products };
}

export function useProductDetail(productId?: string) {
    const { activeStoreId } = useStore();
    return useQuery({
        queryKey: ['product', productId, activeStoreId],
        enabled: !!productId && !!activeStoreId,
        queryFn: () => getProduct(productId as string, activeStoreId as string),
        select: toProduct,
    });
}
