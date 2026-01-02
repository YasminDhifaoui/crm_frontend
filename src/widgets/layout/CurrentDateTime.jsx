import React, { useState, useEffect } from "react";

export default function CurrentDateTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }); // e.g. "Thu, Jul 17, 2025"

  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }); // e.g. "14:35:20"

  return (
    <div className=" bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900  shadow-lg p-3 text-center select-none bg-white rounded-xl shadow p-6 w-full max-w-md">
      <div className="text-xs text-blue-100 font-semibold tracking-wide">
        {dateStr}
      </div>
      <div className="text-white text-xl font-mono mt-1">{timeStr}</div>
    </div>
  );
}
