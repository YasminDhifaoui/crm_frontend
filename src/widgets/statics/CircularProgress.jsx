import React from 'react';

const getColor = (percent) => {
  if (percent <= 10) return 'stroke-red-400';
  if (percent <= 30) return 'stroke-yellow-400';
  if (percent <= 70) return 'stroke-lime-400';
  return 'stroke-green-500';
};

const CircularProgress = ({ realized = 0, objective = 10 }) => {
  const percent = objective > 0 ? Math.min(100, (realized / objective) * 100) : 0;
  const radius = 80;
  const stroke = 20;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset =
    circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb" // gray-200 background
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={getColor(percent)}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          className="text-lg font-bold fill-black"
        >
          {realized}
        </text>
      </svg>
    </div>
  );
};

export default CircularProgress;
