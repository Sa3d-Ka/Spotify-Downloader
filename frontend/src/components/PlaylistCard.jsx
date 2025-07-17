import React from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ playlist }) => {
    const navigate = useNavigate()
  return (
    <div onClick={()=> navigate('/tracks')} className="flex flex-col justify-center gap-2 shadow-dark rounded-xl bg-dark p-4 cursor-pointer hover:-translate-y-2 transition-all duration-500">
      <img
        src={assets.img1}
        alt="Playlist Image"
        className="w-full h-auto rounded object-cover"
      />
      <div>
        <p className="font-bold text-lg">Playlist #1</p>
        <p className="text-sm text-gray-400">2 Tracks</p>
      </div>
    </div>
  );
};

export default PlaylistCard;
