import React, { useState, useEffect } from "react";
import { Home, Search, AlertCircle } from "lucide-react";

const NotFound = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative">

      <div className="max-w-2xl text-center relative z-10">
        {/* Large 404 with glitch effect */}
        <div className="relative mb-8">
          <h1 
            className={`text-9xl md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1db954] via-green-300 to-emerald-400 leading-none transition-all duration-200 ${
              glitchActive ? 'translate-x-1 skew-x-2' : ''
            }`}
            style={{
              textShadow: glitchActive 
                ? '3px 3px 0px rgba(29, 185, 84, 0.5), -3px -3px 0px rgba(29, 185, 84, 0.3)'
                : 'none'
            }}
          >
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[200px] font-black text-[#1db954] blur-2xl -z-10">
            404
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1db954] to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1db954] to-emerald-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* Title and description */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for seems to have wandered off into the digital void. 
          Let's get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/"
            className="group flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-emerald-600 hover:from-[#1ed760] hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-[#1db954]/50 transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Back to Home
          </a>
        </div>

        {/* Error code */}
        <div className="mt-12 text-gray-500 text-sm font-mono">
          ERROR_CODE: PAGE_NOT_FOUND_404
        </div>
      </div>
    </div>
  );
};

export default NotFound;