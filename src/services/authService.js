import api from './api';

export const authService = {
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  getMe: () => api.get('/auth/me').then((r) => r.data),
  changePassword: (payload) => api.put('/auth/change-password', payload).then((r) => r.data),
};
