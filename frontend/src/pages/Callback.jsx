import { useEffect } from "react";
import axios from "axios";
import { usePlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";

const Callback = () => {
  const navigate = useNavigate();
  const { setPlaylists } = usePlaylistContext();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        
        // Small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch playlists (cookies are sent automatically with withCredentials)
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/playlist/user`,
          { withCredentials: true }
        );

        // Update context with playlists
        setPlaylists(response.data.playlists || []);

        // Show success message
        toast.success('Successfully connected to Spotify!');

        // Redirect to dashboard
        navigate('/playlist');

      } catch (error) {
        console.error('Initialization error:', error);
        
        if (error.response?.status === 401) {
          toast.error('Authentication failed. Please try again.');
        } else {
          toast.error('Failed to load your Spotify data');
        }
        
        navigate('/');
      }
    };

    initializeApp();
  }, [navigate, setPlaylists]);

  return (
    <div className="flex items-center gap-3 justify-center min-h-screen">
      <ImSpinner8 size={20} className="animate-spin" />
      <span className="text-2xl text-center">
        Loading your Spotify data...
      </span>
    </div>
  );
};

export default Callback;