import { createContext, useContext, useState } from "react";

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(null); // store fetched playlist data

  return (
    <PlaylistContext.Provider value={{ playlists, setPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => useContext(PlaylistContext);
