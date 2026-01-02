import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function CarsProgressRadialChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  return (
    <div className="flex justify-center items-center p-6 w-full border rounded shadow ">
      <ResponsiveContainer width="100%" height={350}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          barSize={15}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            minAngle={15}
            label={{ position: "insideStart", fill: "#fff" }}
            background
            clockWise
            dataKey="progress"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </RadialBar>
          <Legend
            iconSize={10}
            width={120}
            height={140}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
