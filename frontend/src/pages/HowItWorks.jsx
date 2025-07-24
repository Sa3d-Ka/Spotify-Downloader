import React from "react";
import assets from "../assets/assets";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Find Spotify Playlist",
      description:
        "Open the Spotify app and play the playlist you want to download using SpotiLoad Downloader.",
    },
    {
      number: "2",
      title: "Copy Playlist Link",
      description:
        "Copy the Spotify playlist URL by clicking the three dots next to the playlist and selecting 'Share' then click 'Copy Link'.",
    },
    {
      number: "3",
      title: "Download Music",
      description:
        "Paste the Spotify playlist URL in the box above and hit the 'Download' button to download and save the Spotify music.",
    },
  ];

  const { i1, i2, i3 } = assets;
  const images = [{ image: i3, title: "Long press the playlist." }, { image: i1, title: "Click the Share button."  }, { image: i2, title: "Copy the Link by Clicking the Copy Link Button"  }];

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6 text-center">How It Works</h1>
      <p className="text-center text-gray-500 mb-10">
        Turn any Spotify playlist into downloadable MP3s in a few simple steps.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary bg-green-200 rounded-full py-0.5 px-3">
                {step.number}
              </span>
              <p className="font-bold text-2xl">{step.title}</p>
            </div>
            <p className="text-md text-center">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center gap-2"
          >
            <img className="rounded-xl h-150" src={img.image} alt="ScreenShoot" />
            <p>{img.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
