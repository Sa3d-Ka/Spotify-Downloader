import axios from "axios";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "http://localhost:5173";

const SCOPES = [
  "user-read-email",
  "playlist-read-private",
  "user-library-read",
  "user-read-private",
  "user-top-read",
  // add more scopes as needed
].join(" ");

export const loginWithSpotify = (req, res) => {
  const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
    SCOPES
  )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  res.redirect(authURL);
};

export const exchangeSpotifyCode = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");

  try {
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

    res.redirect(`${FRONTEND_URL}?token=${access_token}`);

    // const playlists = await fetchPlaylistWithTracks(access_token);

    // return res.json({ access_token, refresh_token, playlists });
  } catch (err) {
    console.error("Token exchange error:", err.response?.data || err.message);
    res.status(500).send("Authentication failed");
  }
};

// const fetchPlaylistWithTracks = async (token) => {
//   try {
//     const playlistsRes = await axios.get(
//       "https://api.spotify.com/v1/me/playlists",
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
