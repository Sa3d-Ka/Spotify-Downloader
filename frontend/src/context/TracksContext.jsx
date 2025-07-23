import { createContext, useContext, useState } from "react";

const TracksContext = createContext();

export const TracksProvider = ({ children }) => {
  const [tracks, setTracks] = useState([]);
  return (
    <TracksContext.Provider value={{ tracks, setTracks }}>
      {children}
    </TracksContext.Provider>
  );
};

export const useTracks = () => useContext(TracksContext);
