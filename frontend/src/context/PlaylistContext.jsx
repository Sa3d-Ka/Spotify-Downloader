import { createContext, useContext, useState, useEffect } from "react";

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(() => {
    const sessionActive = localStorage.getItem("hasActiveSession") === "true";
    if (sessionActive) {
      const stored = localStorage.getItem("playlists");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  return (
    <PlaylistContext.Provider value={{ playlists, setPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
};


export const usePlaylistContext = () => useContext(PlaylistContext);