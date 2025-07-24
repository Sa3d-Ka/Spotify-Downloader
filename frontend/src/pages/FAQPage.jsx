import React, { useState } from "react";

const FAQPage = () => {
  const [faq, setFaq] = useState([
    {
      question: "Can I download an entire Spotify playlist as MP3 files?",
      answer:
        'Yes! Just paste your playlist link, and we\'ll convert and let you download the songs either individually or in a ZIP file.',
      open: false,
    },
    {
      question: "Do I need a Spotify Premium account to use this?",
      answer:
        '<span className="font-bold">Nope</span>. You only need a free Spotify account to copy playlist links. We handle the rest through public APIs and YouTube.',
      open: false,
    },
    {
      question: "Is it legal to download music from Spotify like this?",
      answer:
        'We do not download directly from Spotify. Instead, we search for publicly available versions of tracks on YouTube. You are responsible for how you use downloaded files — this service is for personal and educational use only.',
      open: false,
    },
    {
      question: "What format are the downloaded songs?",
      answer:
        'All tracks are downloaded in high-quality MP3 format, ready to use on any device.',
      open: false,
    },
    {
      question: "Can I download from mobile?",
      answer:
        'Yes, but for the best experience (especially downloading ZIPs), we recommend using a desktop browser.',
      open: false,
    },
    {
      question: "Why do some songs fail to download?",
      answer:
        'This usually happens if:\n- The song is not available on YouTube.\n- The track is a local file on Spotify that we cannot access.\n- There are restrictions on the song\'s availability in your region.',
      open: false,
    },
  ]);

  const toggleFaq = (index) => {
    setFaq(
      faq.map((item, i) => {
        if (i === index) {
          item.open = !item.open;
        } else {
          item.open = false;
        }

        return item;
      })
    );
  };

  return (
    <section className="py-2 sm:py-16 lg:py-14">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-400">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {faq.map((item, index) => (
            <div
              key={index}
              className="transition-all duration-200 rounded-xl  bg-dark shadow-darkMedium shadow-xl cursor-pointer hover:bg-darkLight"
            >
              <button
                type="button"
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                onClick={() => toggleFaq(index)}
              >
                <span className="flex text-lg font-semibold text-white">
                  {" "}
                  {item.question}{" "}
                </span>

                <svg
                  className={`w-6 h-6 text-gray-400 ${
                    item.open ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`${
                  item.open ? "block" : "hidden"
                } px-4 pb-5 sm:px-6 sm:pb-6`}
              >
                <p dangerouslySetInnerHTML={{ __html: item.answer }}></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQPage;
