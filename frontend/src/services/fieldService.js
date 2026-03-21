import apiClient from './apiClient';

export const fieldService = {
  getAll:         async ()          => (await apiClient.get('/fields')).data.data,
  getById:        async (id)        => (await apiClient.get(`/fields/${id}`)).data.data,
  getByFarmer:    async (farmerId)  => (await apiClient.get(`/fields/farmer/${farmerId}`)).data.data,
  create:         async (payload)   => (await apiClient.post('/fields', payload)).data.data,
  update:         async (id, p)     => (await apiClient.put(`/fields/${id}`, p)).data.data,
  delete:         async (id)        => (await apiClient.delete(`/fields/${id}`)).data,
};
