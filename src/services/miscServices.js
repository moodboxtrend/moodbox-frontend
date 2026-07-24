import api from './api';

export const dashboardService = {
  summary: () => api.get('/dashboard/summary').then((r) => r.data),
  charts: () => api.get('/dashboard/charts').then((r) => r.data),
};

export const analyticsService = {
  overview: () => api.get('/analytics/overview').then((r) => r.data),
  dailyPosts: (days) => api.get('/analytics/daily-posts', { params: { days } }).then((r) => r.data),
  monthlyPosts: (months) => api.get('/analytics/monthly-posts', { params: { months } }).then((r) => r.data),
};

export const settingsService = {
  get: () => api.get('/settings').then((r) => r.data),
  update: (payload) => api.put('/settings', payload).then((r) => r.data),
  uploadLogo: (formData) =>
    api.post('/settings/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  uploadFavicon: (formData) =>
    api.post('/settings/favicon', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
};

export const searchService = {
  global: (q) => api.get('/search', { params: { q } }).then((r) => r.data),
};

export const userService = {
  list: () => api.get('/users').then((r) => r.data),
  create: (payload) => api.post('/users', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/users/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/users/${id}`).then((r) => r.data),
};
