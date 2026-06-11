import api from './api'

export const customerService = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  getMatches: (id) => api.get(`/customers/${id}/matches`),
  getStats: () => api.get('/customers/stats/summary'),
}

export const matchService = {
  sendMatch: (data) => api.post('/matches/send', data),
  getHistory: (customerId) => api.get(`/matches/history/${customerId}`),
  getAll: () => api.get('/matches/all'),
}

export const noteService = {
  getAll: (customerId) => api.get('/notes', { params: customerId ? { customerId } : {} }),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
}

export const analyticsService = {
  get: () => api.get('/analytics'),
}

export const aiService = {
  explainMatch: (data) => api.post('/ai/explain-match', data),
  generateIntro: (data) => api.post('/ai/generate-intro', data),
  assistant: (data) => api.post('/ai/assistant', data),
}
