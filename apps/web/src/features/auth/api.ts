import { API_ENDPOINTS } from "@/constants";
import api from "@/lib/axios"
export const verifyEmail = async (token: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return response.data;
}
export const  resendVerificationEmail = async (email: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL, { email });
    return response.data;
}