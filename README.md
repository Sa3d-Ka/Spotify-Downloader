# Spotify-Downloader

<p align="center">
  <img src="frontend/public/logo.svg" alt="Logo" width="160"/>
</p>

<p align="center">
  <!-- Version Badges -->
  <img src="https://img.shields.io/badge/node.js-18%2B-green" alt="Node.js"/>
  <img src="https://img.shields.io/badge/npm-9%2B-blue" alt="npm"/>
  <!-- Technology Badges -->
  <img src="https://img.shields.io/badge/Express-4.x-lightgrey?logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/Socket.io-4.x-lightgrey?logo=socket.io" alt="Socket.io"/>
  <img src="https://img.shields.io/badge/React-18.x-blue?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-4.x-purple?logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss" alt="TailwindCSS"/>
</p>

## Description

Spotify-Downloader is a modern web application that enables users to easily download tracks from Spotify playlists as high-quality MP3 files. Users can authenticate with their Spotify account to access their private and public playlists directly, or simply paste any public Spotify playlist URL. The application utilizes YouTube search to fetch the corresponding audio and processes it using FFmpeg, providing real-time download progress and the ability to download multiple tracks as a ZIP archive.

**Key Features:**
- **Spotify Integration:** Login securely with your Spotify account to browse your saved playlists.
- **URL Parsing:** Paste any public Spotify playlist URL to instantly fetch its tracks.
- **Track Selection:** Browse the playlist and select specific tracks to download.
- **Multi-Format Output:** Download individual tracks as MP3 files or download a batch selection as a compressed ZIP file.
- **Real-time Progress:** Live progress indicators for ongoing downloads using WebSocket (Socket.io).

**Target Audience:**
- **End Users:** Music enthusiasts who want offline access to their Spotify playlists without paying for premium subscriptions.
- **Developers:** Those interested in learning how to integrate Spotify OAuth, handle audio processing with FFmpeg, and manage real-time WebSocket communication in a Node.js + React stack.

---

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Usage](#usage)
3. [Architecture Overview](#architecture-overview)
4. [API Reference](#api-reference)
5. [Contributing Guide](#contributing-guide)
6. [Changelog / Versioning](#changelog--versioning)
7. [License](#license)

---

## Installation & Setup

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker & Docker Compose** (Optional, for containerized deployment)

### Spotify API Credentials
To enable Spotify login functionality, you will need Spotify API credentials:
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Create an App.
3. Obtain your `Client ID` and `Client Secret`.
4. Add `http://127.0.0.1:4000/api/auth/callback` (or your appropriate backend port) to the Redirect URIs.

### Step-by-step Setup (Local Development)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/Spotify-Downloader.git
   cd Spotify-Downloader
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://127.0.0.1:4000/api/auth/callback
   VITE_FRONTEND_URL=http://localhost:5173
   PORT=4000
   ```
   Start the backend development server:
   ```bash
   npm run server
   ```

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

### Docker Setup
You can also run the application using Docker Compose:
```bash
docker-compose up --build
```
This will start both the frontend (`http://localhost:5173`) and the backend (`http://localhost:4000`). Make sure your `.env` variables are correctly configured for Docker networking if necessary.

---

## Usage

1. **Start the Application:** Run both frontend and backend servers (or use Docker Compose).
2. **Access the App:** Open your browser and navigate to `http://localhost:5173`.
3. **Fetch a Playlist:**
   - **Login Mode:** Click "Login with Spotify", authenticate, and choose one of your saved playlists.
   - **URL Mode:** Paste a public Spotify playlist URL into the input field and submit.
4. **Download Tracks:**
   - Review the fetched tracks.
   - Click the download icon next to individual tracks to download them as MP3.
   - Select multiple tracks and use the "Download ZIP" option to get a bundled archive.

---

## Architecture Overview

The application follows a client-server architecture.

### Folder Structure
```text
Spotify-Downloader/
├── backend/                  # Express.js REST API & Socket server
│   ├── controllers/          # Request handlers & business logic
│   ├── routes/               # API endpoint definitions
│   ├── server.js             # Main entry point for the backend
│   └── package.json
├── frontend/                 # React frontend application
│   ├── public/               # Static assets (images, logos)
│   ├── src/                  # React components, pages, context
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── docker-compose.yaml       # Docker deployment configuration
```

### Key Components & Data Flow
1. **Frontend (React + Vite):** Handles the user interface, routing, state management, and initiates API requests. Uses Socket.io-client to listen for download progress events.
2. **Authentication (Backend):** Manages the OAuth 2.0 flow with Spotify, generating and storing tokens securely in HTTP-only cookies.
3. **Playlist Resolution:** When a playlist is requested (via User or URL), the backend queries the Spotify API to retrieve the tracklist metadata (Artist, Title, Album Art).
4. **Audio Retrieval:** For downloading, the backend uses packages like `yt-search` or `@distube/ytsr` to find the corresponding audio on YouTube based on the track's metadata. The audio stream is downloaded and converted to MP3 using FFmpeg (`fluent-ffmpeg`).
5. **Real-time Feedback:** As `ffmpeg` processes the audio stream, progress events are emitted via Socket.io back to the specific client requesting the download.

---

## API Reference

### Playlist Endpoints

- **`POST /api/playlist/url`**
  - **Description:** Fetch playlist metadata using a public Spotify URL.
  - **Body:** `{ "url": "spotify_playlist_url" }`
  - **Response:** JSON object containing playlist details and tracklist.

- **`GET /api/playlist/user`**
  - **Description:** Retrieve the logged-in user's Spotify playlists (requires valid auth cookies).
  - **Response:** JSON array of user playlists.

### Download Endpoints

- **`GET /api/stream`**
  - **Description:** Stream and download an individual track as MP3.
  - **Query Parameters:** `?title=SongTitle&artist=ArtistName`
  - **Note:** Real-time progress is broadcasted via Socket.io using the track title as the event identifier.

- **`POST /api/download-zip`**
  - **Description:** Download multiple selected tracks as a compressed ZIP file.
  - **Body:** `{ "tracks": [ { "title": "Song", "artist": "Artist" }, ... ] }`
  - **Response:** A ZIP file stream containing the processed MP3 files.

### Authentication Endpoints

- **`GET /api/auth/login`**
  - **Description:** Redirects the user to Spotify's OAuth authorization page.

- **`GET /api/auth/callback`**
  - **Description:** Handles the redirect from Spotify, exchanges the authorization code for an access token, and sets the auth cookie.

- **`GET /api/auth/status`**
  - **Description:** Checks if the user is currently authenticated. Returns boolean status.
  
- **`POST /api/auth/logout`**
  - **Description:** Clears the authentication cookies, logging the user out.

---

## Contributing Guide

We welcome contributions from the community!

### Code Style
- Use ES6+ syntax.
- Ensure all React components use functional components and hooks.
- Use Tailwind CSS for styling on the frontend.
- Run `npm run lint` in the `frontend` directory before committing to ensure code quality.

### Branch Naming Convention
Please follow these conventions when creating branches:
- `feature/your-feature-name` (e.g., `feature/add-dark-mode`)
- `fix/issue-description` (e.g., `fix/zip-download-bug`)
- `docs/what-you-changed` (e.g., `docs/update-readme`)

### Pull Request Process
1. Fork the repository.
2. Create your feature branch from `main`.
3. Commit your changes with clear, descriptive commit messages.
4. Push to your fork and submit a Pull Request.
5. Provide a detailed description of the changes in the PR.

---

## Changelog / Versioning

### [1.0.0] - 2026-04-25
- **Initial Release**
- Implemented Spotify OAuth Login.
- Added support for pasting public playlist URLs.
- Implemented single track MP3 download with real-time Socket.io progress.
- Implemented batch ZIP download functionality.
- Set up Docker environment for easy deployment.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
