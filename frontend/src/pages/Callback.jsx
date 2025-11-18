// components/Callback.jsx
import { useEffect } from "react";
import { usePlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();
  const { setLoginData } = usePlaylistContext();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for cookies to be set by backend
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch user data and playlists
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/playlist/user`,
          { withCredentials: true }
        );

        // Set login data in context
        setLoginData(response.data.user, response.data.playlists);
        
        navigate("/playlist");

      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Failed to authenticate with Spotify');
        navigate('/');
      }
    };

    initializeApp();
  }, [navigate, setLoginData]);

  return (
    <div className="flex items-center gap-3 justify-center min-h-screen">
      <ImSpinner8 size={20} className="animate-spin" />
      <span className="text-2xl text-center">
        Authenticating with Spotify...
      </span>
    </div>
  );
};

export default Callback;