import { useEffect } from "react";
import { getSpotifyToken } from "../../utils/spotifyToken";
import axios from "axios";
import { usePlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";

const Callback = () => {
  const navigate = useNavigate();
  const { setPlaylists } = usePlaylistContext();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = getSpotifyToken();
        if (!token) throw new Error("No access token available");

        const playlistsRes = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 50 },
            timeout: 10000,
          }
        );

        const BATCH_SIZE = 5;
        const playlistsWithTracks = [];

        for (let i = 0; i < playlistsRes.data.items.length; i += BATCH_SIZE) {
          const batch = playlistsRes.data.items.slice(i, i + BATCH_SIZE);
          const batchResults = await Promise.all(
            batch.map(async (playlist) => {
              try {
                const playlistData = {
                  id: playlist.id,
                  name: playlist.name,
                  image: playlist.images[0]?.url || null,
                  tracks: [],
                };

                if (playlist.tracks.total > 0) {
                  const tracksRes = await axios.get(playlist.tracks.href, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                      limit: 20,
                      fields:
                        "items(track(id,name,artists(name),album(name,images),is_local))",
                    },
                    timeout: 5000,
                  });

                  playlistData.tracks = tracksRes.data.items
                    .filter((item) => item.track && !item.track.is_local)
                    .map((item) => ({
                      id: item.track.id,
                      title: item.track.name,
                      artist: item.track.artists.map((a) => a.name).join(", "),
                      album: item.track.album.name,
                      duration_ms: item.track.duration_ms,
                      image: item.track.album.images?.[0]?.url || null,
                    }));
                }

                return playlistData;
              } catch (trackErr) {
                console.error(
                  `Failed to get tracks for ${playlist.name}:`,
                  trackErr.message
                );
                return {
                  ...playlist,
                  tracks: [],
                  error: "Failed to load tracks",
                };
              }
            })
          );

          playlistsWithTracks.push(...batchResults);

          if (i + BATCH_SIZE < playlistsRes.data.items.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        const storageData = {
          playlists: playlistsWithTracks,
          timestamp: Date.now(),
        };

        setPlaylists(playlistsWithTracks);
        localStorage.setItem("spotifyData", JSON.stringify(storageData));
        navigate("/playlist", { state: { freshLoad: true } });
      } catch (err) {
        const errorMessage =
          err.response?.data?.error?.message ||
          err.message ||
          "Failed to fetch playlists";

        toast.error(`Spotify Error: ${errorMessage}`);

        if (err.response?.status === 401) {
          navigate("/");
        }

        console.error("Playlist fetch error:", err);
      }
    };

    fetchPlaylists();
  }, [navigate, setPlaylists]);

  return (
    <div className="flex items-center gap-3 justify-center">
      <ImSpinner8 size={20} className="animate-spin" />
      <span className="text-2xl text-center mt-4">Authenticating with Spotify...</span>
    </div>
  );
};

export default Callback;
