import type { StorePermission } from '@/src/types/user';

/**
 * Client-side mirror of the backend's User.hasPermission / hasGeneralPermission
 * (RKB_back-main/src/components/user/user.class.js).
 *
 * This only drives UI visibility. The backend still enforces every request.
 */

interface Subject {
    is_root_user: boolean;
    permissions: StorePermission[];
}

/** Permission on a specific store. Root users pass everything. */
export function hasPermission(subject: Subject | null, storeId: string, permission?: string): boolean {
    if (!subject) return false;
    if (subject.is_root_user) return true;
    if (storeId === 'root') return true;
    if (storeId && !permission) return subject.permissions.some((p) => p.store_id === storeId);
    const store = subject.permissions.find((p) => p.store_id === storeId);
    return !!store && store.permissions.includes(permission as string);
}

/** Permission granted on ANY store the user can access. */
export function hasGeneralPermission(subject: Subject | null, permission: string): boolean {
    if (!subject) return false;
    if (subject.is_root_user) return true;
    if (!permission) return false;
    return subject.permissions.some((s) => s.permissions.includes(permission));
}

/** True if at least one of the permissions is granted on any store. */
export function hasAnyGeneralPermission(subject: Subject | null, permissions: string[]): boolean {
    return permissions.some((p) => hasGeneralPermission(subject, p));
}

/** Permission required to see each main tab / screen. */
export const SCREEN_PERMISSIONS = {
    products: ['products.read'],
    cart: ['transaction.create', 'order.create'],
    orders: ['transaction.read', 'order.read'],
    ledger: ['accounts.read'],
} as const;

export type ScreenKey = keyof typeof SCREEN_PERMISSIONS;
