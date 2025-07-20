import React from "react";
import StepTracker from "../components/StepTracker";
import { useParams } from "react-router-dom";
import { usePlaylistContext } from "../context/PlaylistContext";
import { IoSearch } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";

const TracksPage = () => {
  const { id } = useParams();
  const { playlists } = usePlaylistContext();
  const playlist = playlists.find((pl) => pl.id === id);
  const tracks = playlist.tracks;

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div>
      <StepTracker currentStep={2} />
      <div className="flex flex-col gap-4 mx-70">
        <div className="flex justify-between ">
          <h2 className="font-bold text-2xl">{playlist.name}</h2>
          <p className="text-gray-400 text-sm">
            {playlist.tracks.length > 1
              ? `${playlist.tracks.length} Tracks`
              : `${playlist.tracks.length} Track`}
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Tracks..."
            className="bg-dark text-white text-md rounded-md outline-none focus:outline-none focus:ring-0 focus:border-transparent block w-full p-2.5 pl-10"
          />
          <IoSearch
            size={20}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <div className="overflow-x-auto rounded-md shadow">
          <table className="bg-dark min-w-full text-sm text-left text-gray-300">
            <thead className="text-gray-400 uppercase text-xs rounded border-b border-[#535353]">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  #
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Title
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Album
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Duration
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, index) => (
                <tr
                  key={index}
                  className="border-b border-[#212121] hover:bg-[#2a2a2a] transition duration-150"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={track.image}
                        alt="Cover"
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <p className="text-white font-medium">{track.title}</p>
                        <p className="text-sm text-gray-400">{track.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{track.album}</td>
                  <td className="px-4 py-3">
                    {formatDuration(track.duration_ms)}
                  </td>
                  <td>
                    <button className="flex items-center gap-2 bg-primary py-2 px-4 rounded-md cursor-pointer">
                      <span>Download</span> <MdOutlineFileDownload size={20}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TracksPage;
