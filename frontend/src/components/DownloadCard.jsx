import React from "react";

const DownloadCard = ({ track, percent = 0, completed = false }) => {
  
  return (
    <div className="bg-dark py-4 px-4 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2.5">
          <img
            className="w-14 h-14 rounded"
            src={track.album.image || "/fallback.png"}
            alt="Cover"
          />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-md">{track.name}</span>
            <span className="text-sm text-gray-400">{track.artists.map(artist => artist.name).join(", ")}</span>
          </div>
        </div>
        <p>{completed ? "Done" : `${percent || 0}%`}</p>
      </div>
      <div className="w-full h-3 rounded-full bg-darkLight ">
        <div
          style={{ width: `${percent || 0}%` }}
          className="h-full bg-primary rounded-full transition-all duration-300"
        ></div>
      </div>
    </div>
  );
};


export default DownloadCard;
