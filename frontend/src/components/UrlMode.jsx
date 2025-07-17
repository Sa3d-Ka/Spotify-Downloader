import React from "react";
import { useNavigate } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { useState } from "react";
import { toast } from 'react-toastify'

const UrlMode = () => {
  const [urlInput, setUrlInput] = useState("");
  const navigate = useNavigate()

  const handelFetchPlayList = async () => {
    if (!urlInput.includes("open.spotify.com/playlist")) {
      toast.error("Please enter a valid Spotify playlist URL.");
      return
    }
    navigate('/playlist')

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
          id="email"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          class="bg-darkMedium border border-darkLight text-white text-md rounded-s focus:ring-primary focus:border-primary block w-full p-2.5"
          placeholder="https://open.spotify.com/..."
          required
        />
        <button
          onClick={() => handelFetchPlayList()}
          className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-e cursor-pointer"
        >
          <span>Download</span>
          <FiDownload />
        </button>
      </div>
    </div>
  );
};

export default UrlMode;
