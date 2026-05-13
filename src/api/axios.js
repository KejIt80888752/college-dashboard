import axios from 'axios';
import { mockApi } from './mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

let api;

if (USE_MOCK) {
  api = mockApi;
} else {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api`
      : '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );

  api = instance;
}

export default api;
