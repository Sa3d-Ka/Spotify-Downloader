import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import DownloadCard from "../components/DownloadCard";
import StepTracker from "../components/StepTracker";
import { useTracks } from "../context/TracksContext";
import { toast } from "react-toastify";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000", {
  transports: ["websocket"],
  withCredentials: true,
});

const DownloadPage = () => {
  const { tracks } = useTracks();

  const navigate = useNavigate();

  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    if (!tracks.length) {
      navigate("/");
      return;
    }

    setProgress(tracks.map(() => 0));
    setCompleted(tracks.map(() => false));

    tracks.forEach((track, index) => {
      const { title, artist } = track;

      // Create the download URL with query params
      const url = new URL("http://localhost:4000/api/stream");
      url.searchParams.append("title", title);
      url.searchParams.append("artist", artist);
      url.searchParams.append("socketId", socket.id);
      url.searchParams.append("index", index);

      // Create invisible <a> tag and trigger click
      const a = document.createElement("a");
      a.href = url.toString();
      a.setAttribute("download", "");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    socket.on("download-progress", ({ index, percent }) => {
      setProgress((prev) => prev.map((p, i) => (i === index ? percent : p)));
    });

    socket.on("download-complete", ({ index }) => {
      setCompleted((prev) => prev.map((c, i) => (i === index ? true : c)));
    });

    socket.on("download-error", ({ index, message }) => {
      console.error(`Track ${index} Error: ${message}`);
      toast.error(`Track ${index} Error: ${message}`);
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
      <div className="flex flex-col gap-4 lg:mx-50">
        <h2 className="font-bold text-2xl">Downloading Tracks</h2>
        {tracks.map((track, index) => (
          <DownloadCard
            key={index}
            track={track}
            percent={progress[index]}
            completed={completed[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default DownloadPage;
