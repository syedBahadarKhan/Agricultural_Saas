import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://agricultural-backend.vercel.app';
const API_URL = `${BASE_URL.replace(/\/$/, '')}/api/v1`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error formatting
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(error.response.data.error);
    }
    return Promise.reject({ code: 'NETWORK_ERROR', message: error.message });
  }
);

export default apiClient;
