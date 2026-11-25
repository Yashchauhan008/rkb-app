import type {
    LoginCredentials,
    LoginResponse,
    OTPVerificationCredentials,
    StorePermission,
    VerifyLoginResponse,
} from '@/src/types/user';
import axios from './httpRequest';

// NOTE: the RKB backend mounts auth routes at /api (no /auth prefix).
// The axios response interceptor already unwraps `response.data`.

export const accountLogin = (data: LoginCredentials): Promise<LoginResponse> =>
    axios({ method: 'POST', url: '/login', data }) as unknown as Promise<LoginResponse>;

export const otpVerification = (data: OTPVerificationCredentials): Promise<VerifyLoginResponse> =>
    axios({ method: 'POST', url: '/verify-login', data }) as unknown as Promise<VerifyLoginResponse>;

export const accountLogout = () => axios({ method: 'DELETE', url: '/logout' });

/** Live permissions for the current session (also validates the session). */
export const getPermissions = (): Promise<StorePermission[]> =>
    axios({ method: 'GET', url: '/permissions' }) as unknown as Promise<StorePermission[]>;

/** Kill a stale session using the temporary token from a `user_already_logged_in` error. */
export const deleteSession = (sessionId: string, logoutToken: string) =>
    axios({
        method: 'DELETE',
        url: `/sessions/${sessionId}`,
        headers: { Authorization: logoutToken },
    });
