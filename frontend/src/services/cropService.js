import apiClient from './apiClient';

export const cropService = {
  getAll:  async ()            => (await apiClient.get('/crops')).data.data,
  getById: async (id)          => (await apiClient.get(`/crops/${id}`)).data.data,
  create:  async (payload)     => (await apiClient.post('/crops', payload)).data.data,
  update:  async (id, payload) => (await apiClient.put(`/crops/${id}`, payload)).data.data,
  delete:  async (id)          => (await apiClient.delete(`/crops/${id}`)).data,
};
