import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DownloadCard from "../components/DownloadCard";
import StepTracker from "../components/StepTracker";


const DownloadPage = () => {
  const { state } = useLocation();
  const tracks = state?.tracks || [];
  const navigate = useNavigate();

  useEffect(() => {
    if (!tracks.length) {
      navigate("/");
      return;
    }
  }, [tracks, navigate]);

  if (!tracks.length) return null;

  return (
    <div>
      <StepTracker currentStep={3} />
      <div className="flex flex-col gap-4 md:mx-70">
        <h2 className="font-bold text-2xl">Downloading Tracks</h2>
        {tracks.map((track, index) => (
          <DownloadCard
            key={index}
            track={track}
          />
        ))}
      </div>
    </div>
  );
};

export default DownloadPage;
