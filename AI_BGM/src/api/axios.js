// src/api/axios.js
// Centralised Axios instance — all API calls use this so the base URL is set once.
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
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
