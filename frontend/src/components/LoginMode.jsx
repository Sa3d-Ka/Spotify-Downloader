import React from "react";
import { MdLogin } from "react-icons/md";

const LoginMode = () => {
  
  
  const handleSpotifyLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/login";
  };
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center">
        Connect Your Spotify Account
      </h2>
      <p className="text-center text-sm text-grayMuted">
        Login with your Spotify account to access your playlists and start
        downloading your favorite music.
      </p>
      <div className="flex flex-col gap-2 items-center">
        <button onClick={handleSpotifyLogin} className="flex items-center gap-2.5 bg-primary px-5 py-4 rounded-full cursor-pointer">
          <MdLogin size={25} /> <span>Login with Spotify</span>
        </button>
        <p className="mt-3 text-xs text-grayMuted">
          We only request read access to your playlists and tracks.
        </p>
      </div>
    </div>
  );
};

export default LoginMode;
