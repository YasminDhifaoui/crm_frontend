import React, { useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import { FileDown, ImageDown } from "lucide-react";

// Chart colors
const colors = {
  Devis: "#ec4899",
  Commande: "#facc15",
  Facturation: "#22c55e",
  Livraison: "#3b82f6",
  Blockage: "#ef4444",
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded p-3 border text-sm text-gray-700">
        <p className="font-bold mb-1">Month: {label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.stroke }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Convert JSON to CSV
const downloadCSV = (data) => {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(",")).join("\n");
  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "dossiers_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export PNG using html2canvas
const downloadPNG = (ref) => {
  html2canvas(ref.current).then((canvas) => {
    const link = document.createElement("a");
    link.download = "dossiers_chart.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
};

export default function MultiLineDossierChart({ data }) {
  const chartRef = useRef(null);

  return (
    <div className="bg-transparent rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Évolution des dossiers
        </h2>
        <div className="space-x-2 flex">
          <button
            onClick={() => downloadCSV(data)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
            title="Export CSV"
          >
            <FileDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => downloadPNG(chartRef)}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
            title="Export PNG"
          >
            <ImageDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={chartRef}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            {Object.keys(colors).map((status) => (
              <Line
                key={status}
                type="monotone"
                dataKey={status}
                stroke={colors[status]}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
