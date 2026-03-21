import apiClient from './apiClient';

export const farmerService = {
  getAll:    async ()         => (await apiClient.get('/farmers')).data.data,
  getById:   async (id)       => (await apiClient.get(`/farmers/${id}`)).data.data,
  create:    async (payload)  => (await apiClient.post('/farmers', payload)).data.data,
  update:    async (id, payload) => (await apiClient.put(`/farmers/${id}`, payload)).data.data,
  delete:    async (id)       => (await apiClient.delete(`/farmers/${id}`)).data,
};
