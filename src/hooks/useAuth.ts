import { accountLogin, accountLogout, otpVerification } from "@/src/services/api/auth";
import type { LoginCredentials, OTPVerificationCredentials } from "@/src/types/user";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
    return useMutation({
        mutationFn: (data: LoginCredentials) => accountLogin(data),
    });
}

export function useLogout() {
    return useMutation({
        mutationFn: () => accountLogout(),
    });
}

export function useOTPVerification() {
    return useMutation({
        mutationFn: (data: OTPVerificationCredentials) => otpVerification(data),
    });
}

export function useResendOTP() {
    return useMutation({
        mutationFn: (data: LoginCredentials) => accountLogin(data),
    });
}
