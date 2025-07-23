# Spotify-Downloader

![Logo](frontend/public/logo.svg)

<!-- Version Badges -->
![Node.js](https://img.shields.io/badge/node.js-18%2B-green)
![npm](https://img.shields.io/badge/npm-9%2B-blue)

<!-- Technology Badges -->
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-lightgrey?logo=socket.io)
![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.x-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss)

<!-- Existing badges -->
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

![Login Mode](frontend/public/img1.png)
![URL Mode](frontend/public/img2.png)
![Playlist Page](frontend/public/img3.png)
![Tracks Page](frontend/public/img4.png)
![Download Page](frontend/public/img5.png)

---

## Configuration

- **Environment Variables:**

  - `backend/.env`:
    - `SPOTIFY_CLIENT_ID`
    - `SPOTIFY_CLIENT_SECRET`
    - `SPOTIFY_REDIRECT_URI`
    - `VITE_FRONTEND_URL`
    - `PORT`
  - `frontend/.env`:
    - `VITE_BACKEND_URL`

- **Config Files:**
  - `backend/.env`
  - `frontend/.env`

---

## API Reference

- `GET /api/playlist`  
  Fetch playlist information from a Spotify URL.

- `GET /api/stream`  
  Stream and download individual tracks (uses Socket.io for progress).

- `POST /api/download-zip`  
  Download selected tracks as a ZIP file.

- `POST /api/auth`  
  Spotify authentication (login, callback, etc.).

---

## License

MIT License. See [LICENSE](LICENSE) for details.
