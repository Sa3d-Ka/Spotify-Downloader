@echo off
REM Docker Compose Helper Script for Windows
REM This script simplifies docker-compose commands

if "%1"=="" (
    echo Spotify Downloader - Docker Helper
    echo.
    echo Usage: run.bat [command]
    echo.
    echo Commands:
    echo   start       - Start services with build
    echo   up          - Start services (without rebuild^)
    echo   down        - Stop services
    echo   logs        - View all logs
    echo   backend-logs - View backend logs only
    echo   frontend-logs - View frontend logs only
    echo   bash        - Open backend bash shell
    echo   build       - Build images from scratch
    echo   clean       - Remove containers and volumes
    echo.
    goto end
)

if "%1"=="start" (
    echo Starting services with build...
    docker-compose up --build
    goto end
)

if "%1"=="up" (
    echo Starting services...
    docker-compose up
    goto end
)

if "%1"=="down" (
    echo Stopping services...
    docker-compose down
    goto end
)

if "%1"=="logs" (
    docker-compose logs -f
    goto end
)

if "%1"=="backend-logs" (
    docker-compose logs -f backend
    goto end
)

if "%1"=="frontend-logs" (
    docker-compose logs -f frontend
    goto end
)

if "%1"=="bash" (
    docker-compose exec backend bash
    goto end
)

if "%1"=="build" (
    echo Building images...
    docker-compose build --no-cache
    goto end
)

if "%1"=="clean" (
    echo Removing containers and volumes...
    docker-compose down -v
    goto end
)

echo Unknown command: %1
echo Run: run.bat
goto end

:end
