import api from './api';

export const categoryService = {
  list: (params) => api.get('/categories', { params }).then((r) => r.data),
  dropdown: (params) => api.get('/categories/dropdown', { params }).then((r) => r.data),
  get: (id) => api.get(`/categories/${id}`).then((r) => r.data),
  create: (formData) =>
    api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id, formData) =>
    api.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  toggleStatus: (id) => api.patch(`/categories/${id}/status`).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};
