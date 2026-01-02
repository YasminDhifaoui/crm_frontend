import { PICTURE_URL } from "../../api/base";

export default function StaticBarChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-md mt-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Objectifs</h2>
      <div className="space-y-6 ">
        {data.map(({ label, value, color, imgPath, objective, realized }) => (
          <div
            key={label}
            className="flex items-center space-x-4 transform transition duration-300 hover:scale-105 hover:shadow-lg"
          >
            <img
              src={`${PICTURE_URL}${imgPath}`}
              alt={label}
              className="w-10 h-10 rounded-full object-cover "
            />
            <div className="w-full">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${color}`}
                  style={{ width: `${value}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span>Objective: {objective}</span> &nbsp; | &nbsp;
                <span>Realized: {realized}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
