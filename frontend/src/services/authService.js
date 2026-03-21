import apiClient from './apiClient';

export const authService = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data.data;
  },
  register: async (userData) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data.data;
  },
};
