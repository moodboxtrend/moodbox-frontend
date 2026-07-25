import api from './api';

const download = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const postService = {
  list: (params) => api.get('/posts', { params }).then((r) => r.data),
  get: (id) => api.get(`/posts/${id}`).then((r) => r.data),
  create: (formData) =>
    api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id, formData) =>
    api.put(`/posts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  remove: (id) => api.delete(`/posts/${id}`).then((r) => r.data),
  removeImage: (id) => api.delete(`/posts/${id}/image`).then((r) => r.data),

  bulkDelete: (ids) => api.post('/posts/bulk/delete', { ids }).then((r) => r.data),
  bulkStatus: (ids, status) => api.post('/posts/bulk/status', { ids, status }).then((r) => r.data),
  resetViews: (ids, all = false) => api.post('/posts/reset-views', { ids, all }).then((r) => r.data),

  exportCsv: async (ids) => {
    const res = await api.post('/posts/export/csv', { ids }, { responseType: 'blob' });
    download(res.data, `moodbox-posts-${Date.now()}.csv`);
  },
  exportExcel: async (ids) => {
    const res = await api.post('/posts/export/excel', { ids }, { responseType: 'blob' });
    download(res.data, `moodbox-posts-${Date.now()}.xlsx`);
  },
};
