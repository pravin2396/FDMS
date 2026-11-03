import axios from 'axios';

// Base API configuration using DummyJSON for food / recipes
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach simulated auth token if present
api.interceptors.request.use(
  (config) => {
    try {
      const session = localStorage.getItem('fdms_user_session');
      if (session) {
        const { token } = JSON.parse(session);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.warn('Could not parse auth session token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const foodService = {
  // Fetch sample recipes / food items from DummyJSON
  getRecipes: async (limit = 12, skip = 0) => {
    const res = await api.get(`/recipes?limit=${limit}&skip=${skip}`);
    return res.data;
  },
  getRecipeById: async (id) => {
    const res = await api.get(`/recipes/${id}`);
    return res.data;
  },
  searchRecipes: async (query) => {
    const res = await api.get(`/recipes/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};

export default api;
