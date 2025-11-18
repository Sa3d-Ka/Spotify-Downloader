import axios from "axios";

let accessToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  const authString = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = res.data.access_token;
    tokenExpiresAt = Date.now() + res.data.expires_in * 1000;
    return accessToken;
  } catch (err) {
    console.error(
      "Error fetching Spotify access token:",
      err.response?.data || err.message
    );
    throw new Error("Spotify auth failed");
  }
}

const fetchPlaylistFromUrl = async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("open.spotify.com/playlist")) {
    return res.status(400).json({ error: "Invalid Spotify playlist URL" });
  }

  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  const playlistId = match?.[1];

  if (!playlistId)
    return res.status(400).json({ error: "Invalid playlist ID" });

  try {
    const token = await getAccessToken();

    // Fetch playlist details
    const playlistRes = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const playlist = playlistRes.data;

    // Fetch tracks with more details
    const tracksRes = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 100,
          fields:
            "items(track(id,name,artists,album,duration_ms,preview_url,is_playable))",
        },
      }
    );

    // Format the response to match userPlaylist structure
    const responseData = [
      {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description || null,
        owner: playlist.owner?.display_name || "Unknown",
        public: playlist.public || false,
        collaborative: playlist.collaborative || false,
        tracks_count: playlist.tracks?.total || tracksRes.data.total,
        image: playlist.images[0]?.url || null,
        snapshot_id: playlist.snapshot_id,
        uri: playlist.uri,
        href: playlist.href,
        tracks: tracksRes.data.items
          .map((item) => ({
            id: item.track?.id,
            name: item.track?.name,
            artists: item.track?.artists?.map((a) => ({
              id: a.id,
              name: a.name,
            })),
            album: {
              id: item.track?.album?.id,
              name: item.track?.album?.name,
              image: item.track?.album?.images?.[0]?.url || null,
            },
            duration_ms: item.track?.duration_ms,
            preview_url: item.track?.preview_url,
            is_playable: item.track?.is_playable,
            uri: item.track?.uri,
          }))
          .filter((track) => track.id), // Remove null tracks
      },
    ];

    return res.json(responseData);
  } catch (err) {
    console.error(
      "Spotify playlist fetch error:",
      err.response?.status,
      err.response?.data,
      err.message
    );

    // Handle specific error cases
    if (err.response?.status === 401) {
      return res.status(401).json({ error: "Invalid access token" });
    }
    if (err.response?.status === 403) {
      return res
        .status(403)
        .json({ error: "Access forbidden - playlist may be private" });
    }
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    return res
      .status(500)
      .json({ error: "Failed to fetch playlist from Spotify" });
  }
};

export default fetchPlaylistFromUrl;
