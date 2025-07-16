import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaylistPage from "./pages/PlaylistPage";
import DownloadPage from "./pages/DownloadPage";
import Navbar from "./components/Navbar";
import HowItWorks from "./pages/HowItWorks";

const App = () => {
  return (
    <div className="min-h-screen bg-darkMedium text-white px-[10px] py-[20px] md:px-[140px] md:py-[30px]">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/download" element={<DownloadPage />}  />
        </Routes>
    </div>
  );
};

export default App;
