import React, { useEffect } from "react";
import StepTracker from "../components/StepTracker";
import PlaylistCard from "../components/PlaylistCard";
import {
  PlaylistProvider,
  usePlaylistContext,
} from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";

const PlaylistPage = () => {
  const { playlists } = usePlaylistContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!playlists || playlists.length === 0) {
      navigate("/");
    }
  }, [playlists]);

  if (!playlists || playlists.length === 0) {
    return (
      <div className="text-center mt-10">
        <p>No playlists found. Please go back and paste a Spotify URL.</p>
      </div>
    );
  }
  return (
    <div>
      <StepTracker currentStep={1} />
      <h2 className="font-bold text-2xl mb-8">Select a Playlist</h2>
      <div className="mx-4 md:mx-0 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {playlists.map((pl, index) => (
          <PlaylistCard key={index} playlist={pl} />
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;
