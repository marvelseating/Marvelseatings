import axios from 'axios';

const API = axios.create({
  baseURL: 'https://marvel-seating-backend.onrender.com/api',
  //baseURL: '/api',
  timeout: 60000,
});

// Attach JWT token for admin calls
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('marvel_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('marvel_admin_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ─── Public APIs ──────────────────────────────────────
export const getCategories = () => API.get('/categories');
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (slug) => API.get(`/products/${slug}`);
export const getProductModel = (slug, modelNumber) => API.get(`/products/${slug}/models/${modelNumber}`);
export const submitPriceRequest = (data) => API.post('/price-requests', data);
export const getWorks = () => API.get('/works');
export const getTestimonials = () => API.get('/testimonials');
export const submitContact = (data) => API.post('/contact', data);

// ─── Admin APIs ───────────────────────────────────────
export const adminLogin = (data) => API.post('/admin/login', data);
export const getAdminMe = () => API.get('/admin/me');
export const getDashboard = () => API.get('/admin/dashboard');
export const getPriceRequests = (params) => API.get('/price-requests', { params });
export const updatePriceRequest = (id, data) => API.put(`/price-requests/${id}`, data);
export const deletePriceRequest = (id) => API.delete(`/price-requests/${id}`);
export const getContactMessages = () => API.get('/contact');
export const markContactRead = (id) => API.put(`/contact/${id}/read`);

// Products CRUD
export const createProduct = (formData) => API.post('/products', formData);
export const updateProduct = (id, formData) => API.put(`/products/${id}`, formData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addProductModel = (id, formData) => API.post(`/products/${id}/models`, formData);
export const updateProductModel = (id, modelId, formData) => API.put(`/products/${id}/models/${modelId}`, formData);
export const deleteProductModel = (id, modelId) => API.delete(`/products/${id}/models/${modelId}`);

// Works CRUD
export const createWork = (formData) => API.post('/works', formData);
export const updateWork = (id, formData) => API.put(`/works/${id}`, formData);
export const deleteWork = (id) => API.delete(`/works/${id}`);

// Testimonials CRUD
export const createTestimonial = (data) => API.post('/testimonials', data);
export const updateTestimonial = (id, data) => API.put(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => API.delete(`/testimonials/${id}`);

// Categories CRUD
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export default API;
