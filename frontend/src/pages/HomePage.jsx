import React, { useEffect } from "react";
import ModeSwitcher from "../components/ModeSwitcher";

const HomePage = () => {
  useEffect(() => {
    // Clear session when visiting home
    localStorage.removeItem("hasActiveSession");
    localStorage.removeItem("playlists");
  }, []);

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Spotify to MP3</h1>
      <ModeSwitcher />
    </div>
  );
};

export default HomePage;
