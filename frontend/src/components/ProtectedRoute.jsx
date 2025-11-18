import { usePlaylistContext } from "../context/PlaylistContext";
import { Navigate } from "react-router-dom";
import { ImSpinner8 } from "react-icons/im";

const ProtectedRoute = ({ children }) => {
  const { playlists, loading } = usePlaylistContext();
  
  if (loading) {
    return (
      <div className="flex items-center gap-3 justify-center min-h-screen">
        <ImSpinner8 size={20} className="animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }
  
  // Allow access if we have playlists (either from URL or login mode)
  return playlists && playlists.length > 0 ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;