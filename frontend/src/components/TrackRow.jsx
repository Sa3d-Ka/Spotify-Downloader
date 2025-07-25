import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useTracks } from "../context/TracksContext";

const TrackRow = ({ index, track }) => {

  const navigate = useNavigate()
  const { setTracks } = useTracks();

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleDownload = () => {
    setTracks([track])
    navigate("/download")
  };

  return (
    <tr className="border-b border-[#212121] hover:bg-[#2a2a2a] transition duration-150">
      <td className="px-4 py-3">{index + 1}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={track.image} alt="Cover" className="w-12 h-12 rounded" />
          <div>
            <p className="text-white font-medium">{track.title}</p>
            <p className="text-sm text-gray-400">{track.artist}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">{track.album}</td>
      <td className="px-4 py-3">{formatDuration(track.duration_ms)}</td>
      <td>
        <button onClick={handleDownload} className="flex items-center gap-2 bg-primary py-2 px-4 rounded-md cursor-pointer">
          <span>Download</span> <MdOutlineFileDownload size={20} />
        </button>
      </td>
    </tr>
  );
};

export default TrackRow;
