import api from './api';

export const subcategoryService = {
  list: (params) => api.get('/subcategories', { params }).then((r) => r.data),
  dropdown: (params) => api.get('/subcategories/dropdown', { params }).then((r) => r.data),
  get: (id) => api.get(`/subcategories/${id}`).then((r) => r.data),
  create: (payload) => api.post('/subcategories', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/subcategories/${id}`, payload).then((r) => r.data),
  toggleStatus: (id) => api.patch(`/subcategories/${id}/status`).then((r) => r.data),
  remove: (id) => api.delete(`/subcategories/${id}`).then((r) => r.data),
};
