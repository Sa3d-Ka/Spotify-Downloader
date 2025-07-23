# Spotify-Downloader

![Logo](frontend/public/logo.png)

![Build Status](https://img.shields.io/github/workflow/status/yourusername/Spotify-Downloader/CI)
![Test Coverage](https://img.shields.io/codecov/c/github/yourusername/Spotify-Downloader)
![Version](https://img.shields.io/github/package-json/v/yourusername/Spotify-Downloader)
![License](https://img.shields.io/github/license/yourusername/Spotify-Downloader)
![Dependencies](https://img.shields.io/david/yourusername/Spotify-Downloader)

## Description

Spotify-Downloader is a web application that enables users to download tracks from Spotify playlists as MP3 files. You can log in with your Spotify account to access your playlists, or paste a public playlist URL. The app fetches playlist tracks and provides easy download options, including real-time progress updates.

**Key Features:**
- Login with Spotify or paste playlist URL
- Browse and select tracks
- Download tracks as MP3 or ZIP
- Real-time download progress

**Purpose:**  
Makes it easy to download Spotify playlist tracks for offline use, solving the hassle of accessing favorite music without an internet connection.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

### Prerequisites

- Node.js (v18+)
- npm

### Step-by-step Instructions

```bash
git clone https://github.com/yourusername/Spotify-Downloader.git
cd Spotify-Downloader

# Backend setup
cd backend
npm install
npm run server

# Frontend setup
cd ../frontend
npm install
npm run dev
```

---

## Usage

1. **Login with Spotify:**  
   Authenticate to access your playlists.

2. **Paste Playlist URL:**  
   Enter a public Spotify playlist URL.

3. **Download:**  
   Select tracks and download as MP3 or ZIP.

**Screenshots:**

![Main UI](frontend/public/screenshot-main.png)
![Download Progress](frontend/public/screenshot-progress.png)

---

## Configuration

- **Environment Variables:**
  - `backend/.env`:  
    - `SPOTIFY_CLIENT_ID`
    - `SPOTIFY_CLIENT_SECRET`
    - `FRONTEND_URL`
  - `frontend/.env`:  
    - `VITE_BACKEND_URL`

- **Config Files:**  
  - `backend/.env`
  - `frontend/.env`

---

## API Reference

- `GET /api/playlists` - Fetch user playlists
- `POST /api/download` - Download selected tracks
- `GET /api/progress` - Get download progress

---

## Tests

To run tests:

```bash
cd backend
npm test

cd ../frontend
npm test
```

Test coverage reports are generated in `/coverage`.

---

## Contributing

- Follow [Conventional Commits](https://www.conventionalcommits.org/)
- Use 2-space indentation
- Submit pull requests to `main` branch
- Run tests before submitting changes

---

## License

MIT License. See [LICENSE](LICENSE) for details.
