#!/bin/bash
# Docker Compose Helper Script for Linux/Mac
# This script simplifies docker-compose commands

if [ -z "$1" ]; then
    echo "Spotify Downloader - Docker Helper"
    echo ""
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       - Start services with build"
    echo "  up          - Start services (without rebuild)"
    echo "  down        - Stop services"
    echo "  logs        - View all logs"
    echo "  backend-logs - View backend logs only"
    echo "  frontend-logs - View frontend logs only"
    echo "  bash        - Open backend bash shell"
    echo "  build       - Build images from scratch"
    echo "  clean       - Remove containers and volumes"
    echo ""
    exit 0
fi

case "$1" in
    start)
        echo "Starting services with build..."
        docker-compose up --build
        ;;
    up)
        echo "Starting services..."
        docker-compose up
        ;;
    down)
        echo "Stopping services..."
        docker-compose down
        ;;
    logs)
        docker-compose logs -f
        ;;
    backend-logs)
        docker-compose logs -f backend
        ;;
    frontend-logs)
        docker-compose logs -f frontend
        ;;
    bash)
        docker-compose exec backend bash
        ;;
    build)
        echo "Building images..."
        docker-compose build --no-cache
        ;;
    clean)
        echo "Removing containers and volumes..."
        docker-compose down -v
        ;;
    *)
        echo "Unknown command: $1"
        echo "Run: ./run.sh"
        exit 1
        ;;
esac
