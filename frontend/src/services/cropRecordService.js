import apiClient from './apiClient';

export const cropRecordService = {
  getAll:       async ()         => (await apiClient.get('/crop-records')).data.data,
  getById:      async (id)       => (await apiClient.get(`/crop-records/${id}`)).data.data,
  getByField:   async (fieldId)  => (await apiClient.get(`/crop-records/field/${fieldId}`)).data.data,
  getByFarmer:  async (farmerId) => (await apiClient.get(`/crop-records/farmer/${farmerId}`)).data.data,
  create:       async (payload)  => (await apiClient.post('/crop-records', payload)).data.data,
  update:       async (id, p)    => (await apiClient.put(`/crop-records/${id}`, p)).data.data,
  delete:       async (id)       => (await apiClient.delete(`/crop-records/${id}`)).data,
};
