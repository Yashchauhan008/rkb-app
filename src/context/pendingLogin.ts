/**
 * In-memory holder for the credentials between the login and OTP screens.
 * Kept out of router params / storage so the password is never persisted or put in a URL.
 */
let pending: { phone_number: string; password: string; token: string } | null = null;

export const setPendingLogin = (value: { phone_number: string; password: string; token: string }) => {
    pending = value;
};

export const getPendingLogin = () => pending;

export const updatePendingToken = (token: string) => {
    if (pending) pending = { ...pending, token };
};

export const clearPendingLogin = () => {
    pending = null;
};
