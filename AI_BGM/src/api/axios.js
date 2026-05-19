// src/api/axios.js
// Centralised Axios instance — all API calls use this so the base URL is set once.
import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API = axios.create({
  baseURL: isLocal ? '/api' : 'https://complaint-management-service.onrender.com/api',
});

// Automatically attach JWT token to every request if present in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
