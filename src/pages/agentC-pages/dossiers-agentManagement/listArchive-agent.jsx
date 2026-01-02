import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../api/base";
import {
  archiveListAgent,
  unarchiveDossier,
} from "../../../services/agent-services/dossiersAgentServices";
import { toast, ToastContainer } from "react-toastify";
import NavbarAgent from "../../../widgets/layout/agentC-layout/navbar-agent";
import SidebarAgent from "../../../widgets/layout/agentC-layout/sidebar-agent";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const ArchiveAgent = () => {
  const [archives, setArchives] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const statusColors = {
    Devis: "bg-rose-400 text-white",
    Commande: "bg-yellow-400 text-black",
    Facturation: "bg-green-400 text-white",
    Livraison: "bg-blue-500 text-white",
    Blockage: "bg-red-500 text-white",
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      const data = await archiveListAgent();
      setArchives(data);
    } catch (error) {
      toast.error("Failed to fetch archives.");
    }
  };

  const handleUnarchive = async (id) => {
    const success = await unarchiveDossier(id);
    if (success) {
      toast.success("Dossier unarchived!");
      fetchArchives();
    } else {
      toast.error("Failed to unarchive");
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    return (
      <>
        <div>{formattedDate}</div>
        <div className="text-xs text-gray-600">{formattedTime}</div>
      </>
    );
  };

  const statusCount = archives.reduce((acc, dossier) => {
    acc[dossier.status] = (acc[dossier.status] || 0) + 1;
    return acc;
  }, {});

  const filteredArchives = archives.filter((archive) => {
    const matchesSearch = (archive.title + archive.status)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const createdAt = new Date(archive.date_creation);
    const matchesStart = startDate ? new Date(startDate) <= createdAt : true;
    const matchesEnd = endDate ? createdAt <= new Date(endDate) : true;

    return matchesSearch && matchesStart && matchesEnd;
  });

  return (
    <div className="min-h-screen bg-gray-300 text-white font-[Georgia] relative flex flex-col mt-20">
      <NavbarAgent />
      <ToastContainer />
      <div className="flex flex-1 pt-6 px-4 md:px-8">
        <SidebarAgent />
        <main className="flex-1 pl-6 md:pl-12">
          <h2 className="text-xl font-bold mb-4">Archived Dossiers</h2>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            {/* Left: Search */}
            <input
              type="text"
              placeholder="Search by title or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-md w-full md:max-w-xs text-black shadow"
            />

            {/* Right: Status counters and date filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Counters */}
              <div className="flex gap-2 flex-wrap">
                {Object.entries(statusCount).map(([status, count]) => (
                  <div
                    key={status}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
                  >
                    {status}: {count}
                  </div>
                ))}
              </div>

              {/* Date Filter */}
              <div className="flex gap-2 text-black">
                <div className="flex flex-col text-sm">
                  <label className="text-gray-700">From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-2 py-1 rounded-md border"
                  />
                </div>
                <div className="flex flex-col text-sm">
                  <label className="text-gray-700">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-2 py-1 rounded-md border"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border text-sm">
            <thead className="bg-blue-900 text-gray-200">
              <tr>
                <th className="border p-2">Date de création</th>
                <th className="border p-2">Client</th>
                <th className="border p-2">Téléphone</th>
                <th className="border p-2">Modèles</th>
                <th className="border p-2">Immatriculation</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Commentaire</th>
                <th className="border p-2">Date de mise à jour</th>
              </tr>
            </thead>
            <tbody>
              {filteredArchives.map((item) => (
                <tr
                  key={item.id}
                  className="bg-gray-100 hover:bg-gray-400 text-gray-200"
                >
                  <td className="border p-2 text-black">
                    {formatDateTime(item.date_creation)}
                  </td>
                  <td className="border p-2 text-black">
                    {item.nom_prenom_client}
                  </td>
                  <td className="border p-2 text-black">{item.telephone}</td>
                  <td className="border p-2 text-black">{item.modeles}</td>
                  <td className="border p-2 text-black">
                    {item.immatriculation}
                  </td>
                  <td className="border p-2 text-black">
                    <span
                      className={`px-2 py-1 rounded ${
                        item.status === "Commande" ? "text-black" : "text-white"
                      } ${statusColors[item.status] || ""}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="border p-2 text-black">{item.commentaire}</td>
                  <td className="border p-2 text-black">
                    {formatDateTime(item.updated_at)}
                  </td>
                  <td className="border p-2 text-black bg-transparent">
                    <button
                      onClick={() => handleUnarchive(item.id)}
                      className="px-3 py-1 bg-red-900 text-white rounded hover:bg-red-800"
                    >
                      <ArrowUpTrayIcon className="h-5 w-5 " />
                      </button>
                  </td>
                </tr>
              ))}
              {filteredArchives.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="p-4 text-center text-gray-600 bg-white"
                  >
                    No archived dossiers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default ArchiveAgent;
