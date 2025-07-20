import React, { useEffect } from "react";
import StepTracker from "../components/StepTracker";
import { useLocation, useNavigate } from "react-router-dom";

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
        <div className="bg-dark py-4 px-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <img
                className="w-14 h-14 rounded"
                src={track.image || "/fallback.png"}
                alt="Cover"
              />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-md">{track.title}</span>
                <span className="text-sm text-gray-400">{track.artist}</span>
              </div>
            </div>
            <p>64%</p>
          </div>
          <div className="w-full h-3 rounded-full bg-darkLight ">
            <div
              style={{ width: "10%" }}
              className="h-full bg-primary rounded-full transition-all duration-300"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
