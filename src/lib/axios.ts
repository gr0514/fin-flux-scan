import axios from 'axios';

// Get API URL from env, or default to Tye's IdentityService binding (you can change this port later)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5205';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 300000, // Tăng lên 30s vì lần gọi đầu tiên Entity Framework build model rất lâu
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (e.g., token expiration)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and force logout if unauthorized
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
