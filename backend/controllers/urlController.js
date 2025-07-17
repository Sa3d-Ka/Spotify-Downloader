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


const fetchPlaylistFromUrl  = async (req, res) => {
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

    const playlistRes = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const playlist = playlistRes.data;

    const responseData = {
      id: playlist.id,
      name: playlist.name,
      image: playlist.images[0]?.url || null,
      tracks: playlist.tracks.items.map((item) => ({
        title: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(", "),
        album: item.track.album.name,
        duration_ms: item.track.duration_ms,
        image: item.track.album.images[0]?.url || null,
      })),
    };

    return res.json(responseData);
  } catch (err) {
    console.error(
      "Spotify playlist fetch error:",
      err.response?.data || err.message
    );
    return res
      .status(500)
      .json({ error: "Failed to fetch playlist from Spotify" });
  }
};

export default fetchPlaylistFromUrl ;
