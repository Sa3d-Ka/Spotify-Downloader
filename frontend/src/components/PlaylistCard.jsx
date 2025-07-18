import React from "react";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ playlist }) => {
    const navigate = useNavigate()
  return (
    <div onClick={()=> navigate(`/tracks/${playlist.id}`)} className="flex flex-col justify-center gap-2 shadow-dark rounded-xl bg-dark p-4 cursor-pointer hover:-translate-y-2 transition-all duration-500">
      <img
        src={playlist.image}
        alt="Playlist Image"
        className="w-full h-auto rounded object-cover"
      />
      <div>
        <p className="font-bold text-lg">{playlist.name}</p>
        <p className="text-sm text-gray-400">{playlist.tracks.length > 1 ? `${playlist.tracks.length} Tracks` : `${playlist.tracks.length} Track`} </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
