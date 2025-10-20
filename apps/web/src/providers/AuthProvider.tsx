'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api, { clearAuthTokens, setAuthTokens } from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS, ROUTES } from '@/constants';
import { LoginResponse, RegisterData } from '@/features/auth';
import { MESSAGES } from '@/constants/message';
import Cookies from 'js-cookie';
import { User } from '@/features/user';
import { ApiError } from '@/types';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loadUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    setLoading(true);
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get(API_ENDPOINTS.USER.PROFILE);
      setUser(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Tải dữ liệu người dùng thất bại:', error);
      // Don't clear tokens here as the interceptor will handle token refresh
    } finally {
      setLoading(false);
    }
  }, []);
  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      setAuthTokens(data.accessToken);
      await loadUser();
      toast.success(MESSAGES.AUTH.LOGIN_SUCCESS);
      router.push(ROUTES.PROFILE);
      setLoading(false);
    } catch (err) {
      const error = err as ApiError;
      const message =
        error.response?.data?.message || MESSAGES.AUTH.LOGIN_FAILED;
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      setUser(null);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    } finally {
      clearAuthTokens();
      router.push(ROUTES.LOGIN);
      toast.success(MESSAGES.AUTH.LOGOUT_SUCCESS);
    }
  };
  const register = async (registerData: RegisterData) => {
    try {
      setLoading(true);
      await api.post(API_ENDPOINTS.AUTH.REGISTER, registerData);
      toast.success(MESSAGES.AUTH.REGISTER_SUCCESS);
      setLoading(false);
      router.push(ROUTES.LOGIN);
    } catch (err) {
      const error = err as ApiError;
      const message =
        error.response?.data?.message || MESSAGES.AUTH.REGISTER_FAILED;
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      toast.success(MESSAGES.AUTH.FORGOT_PASSWORD_SENT);
      setLoading(false);
      router.push(ROUTES.LOGIN);
    } catch (err) {
      const error = err as ApiError;
      const message =
        error.response?.data?.message || MESSAGES.AUTH.FORGOT_PASSWORD_FAILED;
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };
  const resetPassword = async (
    token: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setLoading(true);
      await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword: password,
        confirmPassword,
      });
      toast.success(MESSAGES.AUTH.RESET_PASSWORD_SUCCESS);
      setLoading(false);
      router.push(ROUTES.LOGIN);
    } catch (err) {
      const error = err as ApiError;
      const message =
        error.response?.data?.message || MESSAGES.AUTH.RESET_PASSWORD_FAILED;
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        forgotPassword,
        resetPassword,
        loadUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
