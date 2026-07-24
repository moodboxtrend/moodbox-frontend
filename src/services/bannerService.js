import api from './api';

export const bannerService = {
  list:    ()        => api.get('/banners').then((r) => r.data),
  get:     (id)      => api.get(`/banners/${id}`).then((r) => r.data),
  create:  (body)    => api.post('/banners', body).then((r) => r.data),
  update:  (id, body)=> api.put(`/banners/${id}`, body).then((r) => r.data),
  remove:  (id)      => api.delete(`/banners/${id}`).then((r) => r.data),
  reorder: (items)   => api.patch('/banners/reorder', items).then((r) => r.data),
};
