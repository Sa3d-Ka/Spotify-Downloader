import React, { useMemo, useState } from "react";
import StepTracker from "../components/StepTracker";
import { useParams } from "react-router-dom";
import { usePlaylistContext } from "../context/PlaylistContext";
import { IoSearch } from "react-icons/io5";
import TrackRow from "../components/TrackRow";
import { MdOutlineFileDownload } from "react-icons/md";

const TracksPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const { id } = useParams();
  const { playlists } = usePlaylistContext();
  const playlist = playlists.find((pl) => pl.id === id);
  const tracks = playlist.tracks;

  const filteredTracks = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword === "") return tracks;

    return tracks.filter((track) =>
      `${track.title} ${track.artist} ${track.album}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [tracks, searchKeyword]);

  return (
    <div>
      <StepTracker currentStep={2} />
      <div className="flex flex-col gap-4 md:mx-70">
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">{playlist.name}</h2>
          <p className="text-gray-400 text-sm">
            {playlist.tracks.length > 1
              ? `${playlist.tracks.length} Tracks`
              : `${playlist.tracks.length} Track`}
          </p>
        </div>
        <div className="relative">
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
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
          <table className="table-auto bg-dark min-w-full text-sm text-left text-gray-300">
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
              {filteredTracks.length > 0 ? (
                filteredTracks.map((track, index) => (
                  <TrackRow
                    key={track.id || index}
                    index={index}
                    track={track}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No matching tracks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center">
          <button className="flex items-center gap-2 bg-primary py-2 px-4 rounded-full cursor-pointer">
            <MdOutlineFileDownload size={20} />
            <span>Download All Tracks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TracksPage;
