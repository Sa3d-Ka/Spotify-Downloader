# Docker Setup Guide - Spotify Downloader

## Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker + Docker Compose (Linux)
- Project dependencies are defined in `package.json` files

## Quick Start

### 1. Clone/Navigate to Project

```bash
cd Spotify-Downloader
```

### 2. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your configuration (optional for local development).

### 3. Build and Start Services

```bash
docker-compose up --build
```

The `--build` flag rebuilds images if `Dockerfile` or dependencies change.

### 4. Access the Application

| Service     | URL                   | Purpose        |
| ----------- | --------------------- | -------------- |
| Frontend    | http://localhost:5173 | React Vite app |
| Backend API | http://localhost:8000 | Express server |

## Services Overview

### Frontend

- **Port:** 5173
- **Technology:** React + Vite
- **Hot Reload:** Enabled via volume mounting
- **Features:** Live development with instant updates

### Backend

- **Port:** 8000
- **Technology:** Node.js + Express
- **Hot Reload:** Enabled with nodemon
- **System Tools:** FFmpeg, Python3, yt-dlp installed
- **Features:** Music downloading, REST APIs

## Common Commands

### Start Services

```bash
docker-compose up
```

### Start in Background

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild Images

```bash
docker-compose up --build
```

### Force Rebuild (Clear Cache)

```bash
docker-compose build --no-cache
```

### Execute Commands in Container

```bash
# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend bash

# Run npm command in backend
docker-compose exec backend npm install package-name
```

### Remove Everything (Clean Slate)

```bash
docker-compose down -v
```

The `-v` flag removes volumes (database data will be deleted).

## Networking

Both frontend and backend are connected to `spotify-network` bridge network, allowing:

- Frontend → Frontend container calls: `http://localhost:5173`
- Backend → Backend container calls: `http://localhost:8000`
- Frontend → Backend from container: `http://backend:8000`
- Inside containers: Use service names (backend) as hostnames

## Backend Dockerfile Details

### Installed System Packages

- **FFmpeg:** For audio encoding/decoding
- **Python3:** Required by yt-dlp
- **yt-dlp:** YouTube content downloader
- **Git & curl:** Utilities for downloads

### Node.js Version

- LTS (currently Node 20)
- Slim variant for smaller image size

### Hot Reload

Run with: `npm run server` (uses nodemon)

## Frontend Dockerfile Details

### Vite Configuration

- Hot Module Replacement (HMR) enabled
- VITE_HOST set to 0.0.0.0 for container access
- Port 5173 exposed

### Hot Reload

Enabled through volume mounting of source code

## Volume Mounts

```yaml
Backend:
  ./backend:/app              # Entire backend folder
  /app/node_modules           # Prevent host node_modules override

Frontend:
  ./frontend:/app             # Entire frontend folder
  /app/node_modules           # Prevent host node_modules override
```

These ensure:

- Changes to source code reflect immediately
- Node modules inside container remain intact
- No conflicts between host and container dependencies

## Troubleshooting

### "Port already in use"

Change ports in `docker-compose.yml`:

```yaml
ports:
  - "NEWPORT:CONTAINERPORT"
```

### Frontend can't connect to backend

Ensure frontend uses `http://backend:8000` inside the container, not `http://localhost:8000`

### Empty node_modules or dependency issues

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Nodemon not restarting

- Ensure volume mount is correct
- Check file permissions
- Restart container: `docker-compose restart backend`

### FFmpeg not found in backend

It's pre-installed. Verify with:

```bash
docker-compose exec backend which ffmpeg
docker-compose exec backend which yt-dlp
```

### Windows Line Ending Issues

If scripts fail, convert line endings:

```bash
# In backend Dockerfile or scripts
dos2unix script.sh
```

Or in `.gitattributes`:

```
*.sh text eol=lf
```

## Production Deployment

For production, consider:

1. **Multi-stage builds** (included in example below)
2. **Environment-specific configs**
3. **Reverse proxy (Nginx)**
4. **SSL/TLS certificates**
5. **Proper logging**
6. **Resource limits**

Example production frontend build:

```dockerfile
FROM node:20-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

## Performance Tips

1. **Use .dockerignore** - Reduces build context
2. **Layer caching** - Order Dockerfile commands by frequency of change
3. **Alpine images** - Smaller images (use `alpine` tag)
4. **Separate dev/prod** - Different docker-compose files
5. **Limit resources** - Add `deploy.resources.limits` in docker-compose

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Vite Documentation](https://vitejs.dev/)

## Notes

- All services restart automatically unless stopped
- Containers share the `spotify-network` bridge network
- Windows users: File permissions might require WSL2 backend
