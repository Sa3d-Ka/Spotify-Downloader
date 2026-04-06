/**
 * Frontend API Configuration
 * Configure axios to communicate with the backend
 * Add this to your frontend initialization (e.g., src/main.jsx or before using axios)
 */

import axios from "axios";

// Determine API URL based on environment
const API_URL = process.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance with proper configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true, // Include cookies if needed for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (optional - for adding tokens, etc)
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor (optional - for handling errors globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);

export default apiClient;

/**
 * Usage Example:
 *
 * import apiClient from './path/to/api-config';
 *
 * // GET request
 * const response = await apiClient.get('/api/endpoint');
 *
 * // POST request
 * const response = await apiClient.post('/api/endpoint', { data });
 *
 * // Inside Docker:
 * // apiClient will automatically use VITE_API_URL=http://backend:8000
 * // Making requests from container will reach http://backend:8000/api/endpoint
 */
