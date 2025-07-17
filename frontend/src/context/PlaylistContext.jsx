import { createContext, useContext, useState } from "react";

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [url, setUrl] = useState(null);           // store playlist URL
  const [playlist, setPlaylist] = useState(null); // store fetched playlist data

  return (
    <PlaylistContext.Provider value={{ url, setUrl, playlist, setPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => useContext(PlaylistContext);
