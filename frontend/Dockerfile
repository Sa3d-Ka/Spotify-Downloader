# Frontend Dockerfile - React + Vite
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5173 (Vite default)
EXPOSE 5173

# Set environment variables
ENV VITE_HOST=0.0.0.0

# Run Vite in development mode with hot-reload
CMD ["npm", "run", "dev"]
