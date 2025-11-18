import axios from "axios";
import crypto from "crypto";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "http://localhost:5173";

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
  "user-top-read",
  // add more scopes as needed
].join(" ");

const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

var stateKey = "spotify_auth_state";

export const loginWithSpotify = (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
    SCOPES
  )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;

  res.redirect(authURL);
};

export const exchangeSpotifyCode = async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    return res.redirect(`${FRONTEND_URL}?error=state_mismatch`);
  }

  if (!code) return res.status(400).send("Missing code");

  try {
    res.clearCookie(stateKey);

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);

    const authToken = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );

    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = tokenRes.data;

    // Set HTTP-only cookies (secure, not accessible by JavaScript)
    res.cookie("spotify_access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.cookie("spotify_refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 3600000, // 30 days
    });

    res.redirect(FRONTEND_URL + '/callback');
  } catch (err) {
    console.error("Token exchange error:", err.response?.data || err.message);
    res.clearCookie(stateKey);
    return res.redirect(`${FRONTEND_URL}?error=authentication_failed`);
  }
};

// const fetchPlaylistWithTracks = async (token) => {
//   try {
//     const playlistsRes = await axios.get(
//       `https://api.spotify.com/v1/me/playlists`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { limit: 50 },
//       }
//     );

//     const playlistsWithTracks = await Promise.all(
//       playlistsRes.data.items.map(async (playlist) => {
//         try {
//           const tracksRes = await axios.get(playlist.tracks.href, {
//             headers: { Authorization: `Bearer ${token}` },
//             params: { limit: 20 },
//           });

//           return {
//             id: playlist.id,
//             name: playlist.name,
//             image: playlist.images[0]?.url || null,
//             tracks: tracksRes.data.items.map((item) => ({
//               id: item.track?.id,
//               name: item.track?.name,
//               artists: item.track?.artists?.map((a) => a.name) || [],
//               album: item.track?.album?.name,
//               duration_ms: item.track?.duration_ms,
//               image: item.track?.album?.images?.[0]?.url || null,
//             })),
//           };
//         } catch (trackErr) {
//           console.error(
//             `Failed to get tracks for playlist ${playlist.id}:`,
//             trackErr.message
//           );
//           return {
//             id: playlist.id,
//             name: playlist.name,
//             image: playlist.images[0]?.url || null,
//             tracks: [],
//             error: "Could not fetch tracks",
//           };
//         }
//       })
//     );

//     return playlistsWithTracks;
//   } catch (err) {
//     console.error("Spotify API error:", err.response?.data || err.message);
//     throw err;
//   }
// };
