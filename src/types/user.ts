export interface LoginCredentials {
    phone_number: string;
    password: string;
}

export interface OTPVerificationCredentials {
    token: string;
    code: string;
}

/** Per-store permission grant, as returned by GET /api/permissions */
export interface StorePermission {
    store_id: string;
    permissions: string[];
}

/** User object returned by the RKB backend on login / verify-login */
export interface User {
    id: string;
    name?: string;
    is_root_user: boolean;
    category: string | null;
    assigned_unit_id?: string | null;
    assigned_unit_store_id?: string | null;
    assigned_unit_name?: string | null;
    assigned_retailer_id?: string | null;
    assigned_retailer_store_id?: string | null;
    assigned_retailer_name?: string | null;
}

/** POST /api/login response */
export interface LoginResponse {
    token_type: 'access' | 'verification';
    token: string;
    /** true when the backend skipped OTP (staff / retailer / manufacturer) */
    otp_bypassed?: boolean;
    delivery?: 'whatsapp' | 'fixed';
    expires_in?: string;
    user?: User;
}

/** POST /api/verify-login response */
export interface VerifyLoginResponse {
    token_type: 'access';
    token: string;
    user: User;
}
