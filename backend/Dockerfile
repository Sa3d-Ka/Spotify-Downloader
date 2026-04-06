# Backend Dockerfile - Node.js + Express + FFmpeg + yt-dlp
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies (FFmpeg, Python3, and yt-dlp)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install --no-cache-dir yt-dlp

# Copy package.json and package-lock.json
COPY package*.json ./

# Install node dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=development
ENV HOST=0.0.0.0

# Run with nodemon for development (hot-reload)
CMD ["npm", "run", "server"]
