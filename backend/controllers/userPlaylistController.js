import axios from "axios";

export const fetchPlaylistsFromUser = async (req, res) => {
  try {
    // Get access token from HTTP-only cookie
    const access_token = req.cookies.spotify_access_token;
    
    if (!access_token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get user info and playlists in parallel for better performance
    const [userResponse, playlistsResponse] = await Promise.all([
      axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      }),
      axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${access_token}` },
        params: { limit: 50 },
      })
    ]);

    // Fetch basic track info for each playlist
    const playlistsWithTracks = await Promise.all(
      playlistsResponse.data.items.map(async (playlist) => {
        try {
          const tracksResponse = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
            {
              headers: { Authorization: `Bearer ${access_token}` },
              params: { 
                limit: 100,
                fields: 'items(track(id,name,artists,album,duration_ms,preview_url,is_playable))'
              },
            }
          );

          return {
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            owner: playlist.owner.display_name,
            public: playlist.public,
            collaborative: playlist.collaborative,
            tracks_count: playlist.tracks.total,
            image: playlist.images[0]?.url || null,
            // Additional useful info:
            snapshot_id: playlist.snapshot_id,
            uri: playlist.uri,
            href: playlist.href,
            tracks: tracksResponse.data.items
              .map((item) => ({
                id: item.track?.id,
                name: item.track?.name,
                artists: item.track?.artists?.map((a) => ({
                  id: a.id,
                  name: a.name
                })),
                album: {
                  id: item.track?.album?.id,
                  name: item.track?.album?.name,
                  image: item.track?.album?.images?.[0]?.url || null
                },
                duration_ms: item.track?.duration_ms,
                preview_url: item.track?.preview_url,
                is_playable: item.track?.is_playable,
                uri: item.track?.uri
              }))
              .filter(track => track.id) // Filter out null tracks
          };
        } catch (trackErr) {
          console.error(`Failed to get tracks for playlist ${playlist.id}:`, trackErr.message);
          return {
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            owner: playlist.owner.display_name,
            image: playlist.images[0]?.url || null,
            tracks_count: playlist.tracks.total,
            tracks: [],
            error: "Could not fetch tracks"
          };
        }
      })
    );

    res.json({ 
      success: true,
      user: {
        id: userResponse.data.id,
        display_name: userResponse.data.display_name,
        email: userResponse.data.email,
        country: userResponse.data.country,
        product: userResponse.data.product // premium/free
      },
      playlists: playlistsWithTracks 
    });

  } catch (err) {
    console.error("Spotify API error:", err.response?.data || err.message);
    
    // Handle specific error cases
    if (err.response?.status === 401) {
      // Token is invalid/expired - clear cookies
      res.clearCookie('spotify_access_token');
      res.clearCookie('spotify_refresh_token');
      return res.status(401).json({ error: "Session expired. Please login again." });
    }
    
    if (err.response?.status === 403) {
      return res.status(403).json({ error: "Insufficient permissions to access playlists." });
    }
    
    res.status(500).json({ 
      error: "Failed to fetch playlists",
      details: err.response?.data?.error?.message || err.message 
    });
  }
};