import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://customercrudbackend-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API calls
export const customerApi = {
  getAll: (params = {}) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  getAddresses: (id) => api.get(`/customers/${id}/addresses`),
};

// Address API calls

export default api;
