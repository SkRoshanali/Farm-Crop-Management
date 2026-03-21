import axios from 'axios';
import toast from 'react-hot-toast';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT on every request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('fcm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
apiClient.interceptors.response.use(
  response => response,
  error => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (status === 401) {
      localStorage.removeItem('fcm_token');
      localStorage.removeItem('fcm_user');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    } else if (status === 403) {
      toast.error('Access denied. Admin role required.');
    } else if (status === 404) {
      toast.error('Resource not found.');
    } else if (status === 400) {
      const valErrors = error.response?.data?.validationErrors;
      if (valErrors) {
        Object.values(valErrors).forEach(msg => toast.error(msg));
      } else {
        toast.error(message);
      }
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
