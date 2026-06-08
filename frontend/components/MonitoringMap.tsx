"use client";

export default function MonitoringMap() {
  return (
    <div className="w-full h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
      <div className="text-center">
        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500 font-semibold">Satellite Imagery</p>
        <p className="text-gray-400 text-sm mt-1">
          Integration coming soon
        </p>
        <p className="text-gray-400 text-xs mt-2 max-w-xs">
          Planet / Sentinel-2 imagery will display vegetation change detection and land use monitoring
        </p>
      </div>
    </div>
  );
}
