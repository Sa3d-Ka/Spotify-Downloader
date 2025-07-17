import { createContext, useContext, useState } from "react";

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState(null); // store fetched playlist data

  return (
    <PlaylistContext.Provider value={{ playlist, setPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => useContext(PlaylistContext);
