import { FaMusic, FaSearch, FaDownload } from "react-icons/fa";

const StepTracker = ({ currentStep = 1 }) => {
  const steps = [
    { icon: <FaMusic />, label: "Playlists" },
    { icon: <FaSearch />, label: "Tracks" },
    { icon: <FaDownload />, label: "Download" },
  ];

  return (
    <div className="flex justify-center items-center gap-3 py-6">
      {steps.map((step, index) => {
        const active = currentStep === index + 1;
        return (
          <div key={index} className="flex items-center gap-2">
            <div className="flex flex-col gap-1.5 justify-center items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  active
                    ? "border-green-500 text-green-500"
                    : "border-gray-600 text-gray-500"
                }`}
              >
                {step.icon}
              </div>
              <p
                className={`text-sm ${
                  active ? "text-green-500" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-50 h-[3px] bg-gray-700 ${
                  currentStep > index + 1 ? "bg-green-500" : "bg-gray-700"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepTracker;
