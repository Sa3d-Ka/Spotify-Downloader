import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaylistPage from "./pages/PlaylistPage";
import DownloadPage from "./pages/DownloadPage";
import Navbar from "./components/Navbar";
import HowItWorks from "./pages/HowItWorks";
import { ToastContainer } from "react-toastify";
import TracksPage from "./pages/TracksPage";
import Callback from "./pages/Callback";
import FAQPage from "./pages/FAQPage";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("spotify_token", token);

      // Clean the URL (remove token from address bar)
      window.history.replaceState({}, document.title, "/");

      // Optionally: navigate to your playlist page
      navigate("/callback");
    }
  }, []);

  return (
    <div className="min-h-screen bg-darkMedium text-white px-[10px] py-[20px] md:px-[20px] md:py-[30px] lg:px-[140px]">
      <ToastContainer theme="dark" />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/playlist" element={<PlaylistPage />} />
        <Route path="/tracks" element={<TracksPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </div>
  );
};

export default App;
