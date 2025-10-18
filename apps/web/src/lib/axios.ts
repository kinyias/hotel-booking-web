import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
const AUTH_WHITELIST = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REFRESH_TOKEN,
  API_ENDPOINTS.AUTH.REGISTER,
];
// Response interceptor to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest.url;
    const isAuthEndpoint = AUTH_WHITELIST.some((url) => requestUrl?.includes(url));
    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        
        const { data } = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`);
        
        // Save the new tokens
        setAuthTokens(data.accessToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        Cookies.remove('accessToken');
        window.location.href = `${API_ENDPOINTS.AUTH.LOGIN}?session=expired`;
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to set auth tokens
export const setAuthTokens = (accessToken: string) => {
  
  // Store tokens in cookies
  Cookies.set('accessToken', accessToken, {expires: 7, secure: true, sameSite: 'strict' });
  
  // Update axios headers
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

// Helper function to clear auth tokens
export const clearAuthTokens = () => {
  Cookies.remove('accessToken');
  delete api.defaults.headers.common.Authorization;
};

export default api;