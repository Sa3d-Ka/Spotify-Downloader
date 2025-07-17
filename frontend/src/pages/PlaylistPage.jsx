import React from "react";
import StepTracker from "../components/StepTracker";
import PlaylistCard from "../components/PlaylistCard";

const PlaylistPage = () => {
  return (
    <div>
      <StepTracker currentStep={1} />
      <h2 className="font-bold text-2xl mb-8">Select a Playlist</h2>
      <div className="mx-4 md:mx-0 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      <PlaylistCard/>
      </div>
    </div>
  );
};

export default PlaylistPage;
