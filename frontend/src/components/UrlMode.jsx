import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiDownload, FiLoader } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";
import { usePlaylistContext } from "../context/PlaylistContext";

const UrlMode = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUrlPlaylists } = usePlaylistContext();
  const navigate = useNavigate();

  const handelFetchPlayList = async () => {
    if (!url.includes("open.spotify.com/playlist")) {
      toast.error("Please enter a valid Spotify playlist URL.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/playlist/url`,
        { url }
      );

      setUrlPlaylists(res.data);
      navigate("/playlist");
    } catch (error) {
      toast.error("Failed to fetch playlist.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center">
        Paste a Spotify Playlist URL
      </h2>
      <p className="text-center text-sm text-grayMuted">
        Simply paste any public Spotify playlist link to fetch its tracks and
        start downloading them as MP3 files
      </p>
      <div className="flex justify-center">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-darkMedium border border-darkLight text-white text-md rounded-s focus:ring-primary focus:border-primary block w-full p-2.5"
          placeholder="https://open.spotify.com/..."
          required
        />
        <button
          onClick={() => handelFetchPlayList()}
          disabled={loading || !url}
          className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-e cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{loading ? "Fetching..." :"Download"}</span>
          {loading ? <FiLoader className="animate-spin" /> :<FiDownload />}
          
        </button>
      </div>
    </div>
  );
};

export default UrlMode;
