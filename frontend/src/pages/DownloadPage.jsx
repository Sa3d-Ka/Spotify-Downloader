import React, { useEffect } from "react";
import StepTracker from "../components/StepTracker";
import { useLocation, useNavigate } from "react-router-dom";
import DownloadCard from "../components/DownloadCard";

const DownloadPage = () => {
  const { state } = useLocation();
  const tracks = state?.tracks || [];
  const navigate = useNavigate();

  useEffect(() => {
    if (!tracks || tracks.length === 0) {
      navigate("/");
    }
  }, [tracks, navigate]);

  if (!tracks || tracks.length === 0) {
    return null;
  }

  console.log(tracks);

  return (
    <div>
      <StepTracker currentStep={3} />
      <div className="flex flex-col gap-4 md:mx-70">
        <h2 className="font-bold text-2xl">Downloading Tracks</h2>
        <div className="flex flex-col gap-1">
          {tracks.map((track, index) => (
            <DownloadCard key={index} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
