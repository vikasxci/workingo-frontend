import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchWorkers = (params) => API.get('/workers', { params });
export const fetchWorkerById = (id) => API.get(`/workers/${id}`);
export const createBooking = (data) => API.post('/bookings', data);
export const getBookings = () => API.get('/bookings');
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getCurrentUser = () => API.get('/auth/me');