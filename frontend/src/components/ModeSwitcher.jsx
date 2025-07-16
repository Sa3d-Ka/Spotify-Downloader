import { useState } from "react";
import { FaLink } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import LoginMode from "./LoginMode";
import UrlMode from "./UrlMode";

export default function ModeSwitcher({ onModeChange }) {
  const [activeTab, setActiveTab] = useState("login"); // or 'url'

  const handleSwitch = (mode) => {
    setActiveTab(mode);
    if (onModeChange) onModeChange(mode); // optional callback to parent
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative right-0">
        <ul
          className="relative flex flex-wrap list-none px-1.5 py-1.5 rounded-md bg-dark"
          role="list"
        >
          {/* Login Tab */}
          <li className="z-30 flex-auto text-center">
            <button
              onClick={() => handleSwitch("login")}
              className={`z-30 flex items-center justify-center gap-2.5 w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                activeTab === "login"
                  ? "text-white bg-primary"
                  : "text-white bg-dark"
              }`}
              role="tab"
              aria-selected={activeTab === "login"}
            >
              <IoPerson />
              <span>Login</span>
            </button>
          </li>

          {/* URL Tab */}
          <li className="z-30 flex-auto text-center">
            <button
              onClick={() => handleSwitch("url")}
              className={`z-30 flex items-center justify-center gap-2.5 w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                activeTab === "url"
                  ? "text-white bg-primary"
                  : "text-white bg-dark"
              }`}
              role="tab"
              aria-selected={activeTab === "url"}
            >
              <FaLink />
              <span>Paste URL</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Optional content below switch */}
      <div className="mt-6">
        {activeTab === "login" ? (<LoginMode />) : (<UrlMode />)}
      </div>
    </div>
  );
}
