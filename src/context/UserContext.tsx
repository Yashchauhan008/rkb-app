import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { hasAnyGeneralPermission, hasGeneralPermission, hasPermission } from "../lib/permissions";
import { accountLogout, getPermissions } from "../services/api/auth";
import { StorePermission, User } from "../types/user";
import {
    clearAuthData,
    getAuthToken,
    getUserData,
    saveAuthToken,
    saveUserData,
} from "./storage";

interface UserContextType {
    user: User | null;
    permissions: StorePermission[];
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshPermissions: () => Promise<void>;
    /** Permission on a specific store (root users always pass). */
    can: (storeId: string, permission?: string) => boolean;
    /** Permission on ANY accessible store. */
    canAny: (permission: string) => boolean;
    /** At least one of the permissions on any store. */
    canAnyOf: (permissions: readonly string[]) => boolean;
    /** Store ids the user can access (empty for root = all stores). */
    storeIds: string[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<StorePermission[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const reset = useCallback(async () => {
        await clearAuthData();
        queryClient.clear();
        setUser(null);
        setPermissions([]);
        setIsAuthenticated(false);
    }, [queryClient]);

    const refreshPermissions = useCallback(async () => {
        const data = await getPermissions();
        setPermissions(Array.isArray(data) ? data : []);
    }, []);

    // Restore session on app start and verify it against the backend.
    useEffect(() => {
        (async () => {
            try {
                const [token, stored] = await Promise.all([getAuthToken(), getUserData()]);
                if (!token || !stored) return;
                setUser(stored);
                try {
                    // Also validates the session (expired -> 401 -> interceptor clears auth).
                    await refreshPermissions();
                    setIsAuthenticated(true);
                } catch (err: any) {
                    // Only drop the session if the server rejected it, not on network errors.
                    if (err?.code === "unauthorized") {
                        await reset();
                    } else {
                        setIsAuthenticated(true);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        })();
    }, [refreshPermissions, reset]);

    const login = useCallback(async (userData: User, token: string) => {
        await saveAuthToken(token);
        await saveUserData(userData);
        setUser(userData);
        try {
            await refreshPermissions();
        } catch {
            setPermissions([]);
        }
        setIsAuthenticated(true);
    }, [refreshPermissions]);

    const logout = useCallback(async () => {
        try {
            await accountLogout(); // best effort: invalidate the server session
        } catch {
            // ignore: clear local state regardless
        }
        await reset();
    }, [reset]);

    const value = useMemo<UserContextType>(() => {
        const subject = user ? { is_root_user: !!user.is_root_user, permissions } : null;
        return {
            user,
            permissions,
            isAuthenticated,
            isLoading,
            login,
            logout,
            refreshPermissions,
            can: (storeId, permission) => hasPermission(subject, storeId, permission),
            canAny: (permission) => hasGeneralPermission(subject, permission),
            canAnyOf: (list) => hasAnyGeneralPermission(subject, [...list]),
            storeIds: permissions.map((p) => p.store_id),
        };
    }, [user, permissions, isAuthenticated, isLoading, login, logout, refreshPermissions]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
