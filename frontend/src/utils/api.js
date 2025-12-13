import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Story API
export const storyAPI = {
  generate: (data) => api.post('/story/generate', data),
  getAll: () => api.get('/story'),
  getById: (id) => api.get(`/story/${id}`),
  updateStatus: (id, status) => api.put(`/story/${id}/status`, { status }),
  delete: (id) => api.delete(`/story/${id}`),
};

// Avatar API
export const avatarAPI = {
  generate: (formData) => api.post('/avatar/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => api.get('/avatar'),
  getById: (id) => api.get(`/avatar/${id}`),
  delete: (id) => api.delete(`/avatar/${id}`),
};

// Panel API
export const panelAPI = {
  generate: (data) => api.post('/panel/generate', data),
  generateAll: (storyId) => api.post('/panel/generate-all', { storyId }),
};

// Book API
export const bookAPI = {
  build: (storyId) => api.post('/book/build', { storyId }),
  getPreview: (storyId) => api.get(`/book/preview/${storyId}`),
};

export default api;
