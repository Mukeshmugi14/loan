import axios from 'axios';
import { env } from '../config/env';

const API_URL = env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // For cookies if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  sendOtp: (data: { email: string; type: 'signup' | 'forgot' }) => apiClient.post('/auth/send-otp', data),
  verifyOtp: (data: { email: string; otp: string }) => apiClient.post('/auth/verify-otp', data),
  signup: (data: any) => apiClient.post('/auth/signup', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  googleAuth: (credential: string) => apiClient.post('/auth/google', { credential }),
  resetPassword: (data: any) => apiClient.post('/auth/reset-password', data),
  logout: (refreshToken: string) => apiClient.post('/auth/logout', { refreshToken }),
  getMe: () => apiClient.get('/auth/me'),
};

export default apiClient;
