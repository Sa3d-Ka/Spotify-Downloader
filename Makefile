.PHONY: help build up down logs restart clean bash build-prod ps

help:
	@echo "Spotify Downloader - Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make build       - Build development images"
	@echo "  make up          - Start development services"
	@echo "  make down        - Stop development services"
	@echo "  make logs        - View logs"
	@echo "  make restart     - Restart services"
	@echo "  make clean       - Remove everything (containers, volumes)"
	@echo "  make bash        - Open backend shell"
	@echo "  make ps          - Show running containers"
	@echo ""
	@echo "Production:"
	@echo "  make build-prod  - Build production images"
	@echo "  make up-prod     - Start production services"
	@echo ""

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

clean:
	docker-compose down -v

bash:
	docker-compose exec backend bash

ps:
	docker-compose ps

build-prod:
	docker-compose -f docker-compose.prod.yml build

up-prod:
	docker-compose -f docker-compose.prod.yml up -d

# Advanced targets
pull-images:
	docker pull node:20-slim
	docker pull mongo:7-alpine
	docker pull nginx:alpine

inspect-backend:
	docker-compose exec backend sh

inspect-frontend:
	docker-compose exec frontend sh

inspect-mongo:
	docker-compose exec mongo sh

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-mongo:
	docker-compose logs -f mongo

shell-backend:
	docker-compose exec backend bash

shell-frontend:
	docker-compose exec frontend bash

# Prune unused Docker resources
prune:
	docker system prune -f

prune-all:
	docker system prune -a -f

# View resource usage
stats:
	docker stats
