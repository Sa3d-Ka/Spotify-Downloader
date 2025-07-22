import React, { useEffect, useState } from "react";
import StepTracker from "../components/StepTracker";
import { useLocation, useNavigate } from "react-router-dom";
import DownloadCard from "../components/DownloadCard";
import io from "socket.io-client";
import axios from "axios";

const socket = io(import.meta.env.VITE_BACKEND_URL); // Replace with your backend URL if different

const DownloadPage = () => {
  const { state } = useLocation();
  const tracks = state?.tracks || [];
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [complete, setComplete] = useState([]);

  useEffect(() => {
    if (!tracks || tracks.length === 0) {
      navigate("/");
      return;
    }

    setProgress(tracks.map(() => 0));
    setComplete(tracks.map(() => false));

    // SOCKET LISTENERS
    socket.on("download-progress", ({ index, percent }) => {
      setProgress((prev) => {
        const updated = [...prev];
        updated[index] = percent;
        return updated;
      });
    });

    socket.on("download-complete", ({ index }) => {
      setComplete((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
    });

    socket.on("download-error", ({ index, title, message }) => {
      console.error(
        `Error downloading track ${title || `#${index}`}: ${message}`
      );
    });

    // POST to trigger download
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/download`, {
      tracks,
      socketId: socket.id,
    });

    return () => {
      socket.off("download-progress");
      socket.off("download-complete");
      socket.off("download-error");
    };
  }, [tracks, navigate]);

  if (!tracks.length) return null;

  return (
    <div>
      <StepTracker currentStep={3} />
      <div className="flex flex-col gap-4 md:mx-70">
        <h2 className="font-bold text-2xl">Downloading Tracks</h2>
        <div className="flex flex-col gap-1">
          {tracks.map((track, index) => (
            <DownloadCard
              key={index}
              track={track}
              percent={progress[index]}
              completed={complete[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
