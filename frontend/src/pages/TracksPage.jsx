import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StepTracker from "../components/StepTracker";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlaylistContext } from "../context/PlaylistContext";
import { IoSearch } from "react-icons/io5";
import TrackRow from "../components/TrackRow";
import { MdOutlineFileDownload } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";

const TracksPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state?.id;
  const { playlists } = usePlaylistContext();

  const playlist = playlists.find((pl) => pl.id === id);
  const tracks = playlist?.tracks || [];

  const filteredTracks = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword === "") return tracks;
    return tracks.filter((track) =>
      `${track.name} ${track.artists.map(a => a.name).join(" ")} ${track.album.name}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [tracks, searchKeyword]);
  

  useEffect(() => {
    if (!playlists.length || !id || !playlist) {
      navigate("/");
    }
  }, [playlists, id, playlist, navigate]);

  // Return fallback UI if playlist isn't loaded yet
  if (!playlist) {
    return null;
  }

  const downloadZip = async () => {
    try {
      setLoading(true); // start loading
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/download-zip`,
        { tracks },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tracks.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("ZIP download failed:", error);
      alert("Download failed.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div>
      <StepTracker currentStep={2} />
      <div className="flex flex-col gap-4 lg:mx-50">
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">{playlist.name}</h2>
          <p className="text-gray-400 text-sm">
            {tracks.length > 1
              ? `${tracks.length} Tracks`
              : `${tracks.length} Track`}
          </p>
        </div>

        {/* Search */}
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

        {/* Track Table */}
        <div className="overflow-x-auto rounded-md shadow">
          <table className="table-auto bg-dark min-w-full text-sm text-left text-gray-300">
            <thead className="text-gray-400 uppercase text-xs rounded border-b border-[#535353]">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Album</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Action</th>
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

        {/* Download All Button */}
        <div className="flex justify-center">
          <button
            onClick={downloadZip}
            disabled={loading}
            className="flex items-center gap-2 bg-primary py-2 px-4 rounded-full cursor-pointer"
          >
            {loading ? (
              <ImSpinner8 className="animate-spin" />
            ) : (
              <MdOutlineFileDownload size={20} />
            )}
            <span>{loading ? "Downloading..." : "Download All Tracks"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TracksPage;
