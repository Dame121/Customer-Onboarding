import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerCustomer = (data) => API.post('/customers/register', data);
export const loginCustomer = (data) => API.post('/customers/login', data);
export const getProfile = () => API.get('/customers/profile');

export default API;
