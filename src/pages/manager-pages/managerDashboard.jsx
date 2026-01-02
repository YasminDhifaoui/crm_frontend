import React, { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TruckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";

import Navbar from "../../widgets/layout/manager-layout/navbar";
import Sidebar from "../../widgets/layout/manager-layout/sidebar";
import CurrentDateTime from "../../widgets/layout/CurrentDateTime";
import CircularProgress from "../../widgets/statics/CircularProgress";
import StaticBarChart from "../../widgets/statics/StaticBarChart";
import MultiLineDossierChart from "../../widgets/statics/MultiLineDossierChart";
import CarsProgressRadialChart from "../../widgets/statics/CarsProgressRadialChart";
import StatisticsCard from "../../widgets/statics/statistics-card";

import {
  getDossierStats,
  fetchCarCategoryProgress,
  fetchDossiersCountPerMonth,
  fetchObjectifsProgress,
  fetchUserObjectivesWithProgress,
} from "../../services/manager_services/staticsService";

// Icons per status
const statusIcons = {
  Devis: DocumentTextIcon,
  Commande: ArrowUpIcon,
  Facturation: CheckCircleIcon,
  Livraison: TruckIcon,
  Blockage: ExclamationTriangleIcon,
};

// Colors per status
const statusColors = {
  Devis: "text-pink-400",
  Commande: "text-yellow-400",
  Facturation: "text-green-400",
  Livraison: "text-blue-400",
  Blockage: "text-red-400",
};

export function Home() {
  const [statisticsCardsData, setStatisticsCardsData] = useState([]);
  const [carCategoryData, setCarCategoryData] = useState([]);
  const [dossiersPerMonth, setDossiersPerMonth] = useState([]);
  const [objectifData, setObjectifData] = useState([]);
  const [progress, setProgress] = useState({ realized: 0, objective: 0 });

  useEffect(() => {
    getDossierStats().then((res) => {
      if (res.success) {
        const data = res.data.map((item) => {
          const icon = statusIcons[item.status] || ArrowUpIcon;
          return {
            icon,
            title: "Dossiers",
            status: item.status,
            value: item.count,
            footer: {
              label: "total",
              value: `+${item.count}`,
              color: statusColors[item.status] || "text-gray-400",
            },
          };
        });
        setStatisticsCardsData(data);
      }
    });
    fetchCarCategoryProgress()
      .then((data) => {
        if (Array.isArray(data)) {
          setCarCategoryData(data);
        } else {
          console.error("API returned non-array data:", data);
          setCarCategoryData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching car category data:", error);
        setCarCategoryData([]);
      });

    fetchDossiersCountPerMonth()
      .then((data) => {
        if (Array.isArray(data)) {
          setDossiersPerMonth(data);
        } else {
          console.error("API returned non-array data:", data);
          setDossiersPerMonth([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching dossiers per month:", error);
        setDossiersPerMonth([]);
      });
    fetchObjectifsProgress()
      .then((res) => {
        if (res.success) {
          const { total_objective, total_realized } = res.data;

          // Update progress state directly
          setProgress({
            realized: total_realized,
            objective: total_objective,
          });

          // If you want to use objectifData for a chart or something:
          setObjectifData([
            {
              label: "Progress",
              value:
                total_objective > 0
                  ? Math.round((total_realized / total_objective) * 100)
                  : 0,
              color:
                total_realized / total_objective > 0.75
                  ? "bg-green-500"
                  : total_realized / total_objective > 0.4
                  ? "bg-yellow-400"
                  : "bg-red-400",
              imgPath: "/img/default-avatar.png",
            },
          ]);
        } else {
          console.error("Failed to fetch objectifs progress");
        }
      })
      .catch((err) => console.error("Error fetching objectifs:", err));
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

    const fetchData = async () => {
      try {
        const res = await fetchUserObjectivesWithProgress(currentMonth);
        if (res.success) {
          // Map data to fit StaticBarChart format
          const formatted = res.data.map(
            ({ name, objective, realized, imgPath }) => {
              const progressPercent =
                objective > 0 ? Math.round((realized / objective) * 100) : 0;

              return {
                label: name,
                value: progressPercent,
                color:
                  progressPercent > 75
                    ? "bg-green-500"
                    : progressPercent > 40
                    ? "bg-yellow-400"
                    : "bg-red-400",
                imgPath,
                objective,
                realized,
              };
            }
          );
          setObjectifData(formatted);
        } else {
          console.error("Failed to load objectifs data");
          setObjectifData([]);
        }
      } catch (error) {
        console.error("Error fetching objectifs:", error);
        setObjectifData([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-300 text-white font-[Georgia] pt-20">
      {/* Navbar */}
      <Navbar />

      <div className="flex px-4 md:px-8 pt-6">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content */}
        <main className="flex-1 pl-6 md:pl-12">
          {/* Statistic Cards */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5 mb-12">
            {statisticsCardsData.map(
              ({ icon, title, status, footer, ...rest }) => (
                <div
                  key={status}
                  className="transform transition duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <StatisticsCard
                    {...rest}
                    title={
                      <span>
                        {title}:&nbsp;
                        <span className={footer.color}>{status}</span>
                      </span>
                    }
                    icon={
                      <div
                        className={`rounded-full p-2 ${footer.color} bg-opacity-20`}
                      >
                        {React.createElement(icon, {
                          className: `w-6 h-6 ${footer.color}`,
                        })}
                      </div>
                    }
                    footer={
                      <Typography className="font-normal text-gray-300 text-sm">
                        <strong className={footer.color}>{footer.value}</strong>
                        &nbsp;{footer.label}
                      </Typography>
                    }
                  />
                </div>
              )
            )}
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2 mb-12">
            <CarsProgressRadialChart data={carCategoryData} />{" "}
            <MultiLineDossierChart data={dossiersPerMonth} />
          </div>
        </main>

        {/* Sidebar Right */}
        <aside className="w-full md:w-64 ml-6 space-y-6">
          <CurrentDateTime />
          <CircularProgress
            realized={progress.realized}
            objective={progress.objective}
          />
          <div className="mt-2 text-black font-semibold text-center">
            Total Objective: {progress.objective}
          </div>
          <StaticBarChart data={objectifData} />
        </aside>
      </div>
    </div>
  );
}

export default Home;
