import axios from 'axios';

// 1. Base URL se koi bhi accidental comma hatane ke liye .replace() ka use karein
const rawBaseUrl = import.meta.env.VITE_BASE_URL || 'https://airbnb-backend-3min.onrender.com';
const BASE_URL = rawBaseUrl.replace(/,/g, '').trim();

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 2. Request Interceptor: Konsa URL ja raha hai wo console par print karega
axiosInstance.interceptors.request.use((config) => {
  console.log("Axios Request URL:", config.baseURL + (config.url.startsWith('/') ? config.url : '/' + config.url));
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;