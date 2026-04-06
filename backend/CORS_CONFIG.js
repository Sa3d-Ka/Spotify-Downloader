/**
 * CORS Configuration for Express Backend
 * Add this to your backend server setup (server.js)
 * This allows the frontend to communicate with the backend
 */

// Example configuration for server.js:
/*

import cors from 'cors';
import express from 'express';

const app = express();

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com'
    : ['http://localhost:5173', 'http://frontend:5173', 'http://0.0.0.0:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
};

app.use(cors(corsOptions));

// Rest of your configuration...

*/

// For development with docker-compose:
// The frontend service can reach backend at: http://backend:8000
// Make sure to:
// 1. Add cors middleware to express
// 2. Set proper CORS origins to allow requests from frontend
// 3. Use environment variables to switch between dev/prod CORS settings

export default {
  development: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://frontend:5173",
      "http://0.0.0.0:5173",
    ],
    credentials: true,
  },
  production: {
    origin: process.env.FRONTEND_URL || "https://yourdomain.com",
    credentials: true,
  },
};
