import React, { useEffect } from "react";
import StepTracker from "../components/StepTracker";
import { useLocation, useNavigate } from "react-router-dom";
// import DownloadCard from "../components/DownloadCard";

const DownloadPage = () => {
  const { state } = useLocation();
  const track = state?.track;
  const navigate = useNavigate();

  useEffect(() => {
    if (!track || Object.keys(track).length === 0) {
      navigate("/");
    }
  }, [track, navigate]);

  if (!track || Object.keys(track).length === 0) {
    return null; // or a loading indicator
  }

  return (
    <div>
      <StepTracker currentStep={3} />
      <div className="flex flex-col gap-4 md:mx-70">
        <h2 className="font-bold text-2xl">Downloading Tracks</h2>
        {/* <DownloadCard track={track} /> */}
        
      </div>
    </div>
  );
};

export default DownloadPage;
