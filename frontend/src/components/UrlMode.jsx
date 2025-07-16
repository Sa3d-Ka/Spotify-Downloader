import React from "react";
import { FiDownload } from "react-icons/fi";

const UrlMode = () => {
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
          class="bg-darkMedium border border-darkLight text-white text-sm rounded-s focus:ring-primary focus:border-primary block w-full p-2.5"
          placeholder="https://open.spotify.com/..."
          required
        />
        <button className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-e cursor-pointer">
          <span>Download</span>
          <FiDownload />
        </button>
      </div>
    </div>
  );
};

export default UrlMode;
