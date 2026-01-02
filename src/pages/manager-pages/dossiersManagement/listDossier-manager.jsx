import React, { useState, useEffect } from "react";
import Select from "react-select";
import { BASE_URL, PICTURE_URL } from "../../../api/base";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../../widgets/layout/manager-layout/navbar";
import Sidebar from "../../../widgets/layout/manager-layout/sidebar";
import {
  dossiersListManager,
  listCarsManager,
  addDossiersManager,
  updateDossier,
  archiveDossiersManager,
} from "../../../services/manager_services/dossiersService";
import {
  customSingleValue,
  customOption,
} from "../../../widgets/components/customSingleValue";

import {
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  PencilIcon,
  EyeIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/solid";

const statusOptions = [
  "Devis",
  "Commande",
  "Facturation",
  "Livraison",
  "Blockage",
];

const DossiersPageManager = () => {
  const [dossiers, setDossiers] = useState([]);
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom_prenom_client: "",
    telephone: "",
    modeles: "",
    commentaire: "",
    status: "Devis",
    immatriculation: "",
    commentaire_file: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    loadDossiers();
    loadCars(); // load cars on component mount
  }, []);

  const loadDossiers = async () => {
    try {
      const result = await dossiersListManager();
      if (result.message) {
        setDossiers(result.message);
      }
    } catch (error) {
      console.error("Failed to load dossiers:", error);
    }
  };
  const loadCars = async () => {
    try {
      const result = await listCarsManager();
      console.log("API result:", result); // For debugging
      if (result.success && Array.isArray(result.data)) {
        setCars(result.data); // ✅ Use result.data
      }
    } catch (error) {
      console.error("Failed to load cars:", error);
    }
  };
  const carOptions = cars.map((car) => ({
    value: car.model_name,
    label: `${car.category} _ ${car.model_name}`,
    image: `${PICTURE_URL}/${car.image_path}`,
  }));

  const statusColors = {
    Devis: "bg-rose-400 text-white",
    Commande: "bg-yellow-400 text-black",
    Facturation: "bg-green-400 text-white",
    Livraison: "bg-blue-500 text-white",
    Blockage: "bg-red-500 text-white",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "immatriculation") {
      // Allow only up to 18 alphanumeric chars
      if (/^[a-zA-Z0-9]{0,18}$/.test(value)) {
        setFormData((prev) => ({ ...prev, immatriculation: value }));
      }
    } else if (name === "telephone") {
      // Allow only digits, up to 8 chars
      if (/^\d{0,8}$/.test(value)) {
        setFormData((prev) => ({ ...prev, telephone: value }));
      }
    } else if (name === "status" && value.toLowerCase() !== "livraison") {
      // Clear immatriculation if status not 'livraison'
      setFormData((prev) => ({ ...prev, status: value, immatriculation: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addDossiersManager(formData);
      console.log("Dossier added:", res);
      console.log(formData);

      toast.success("Dossier added successfully");

      setFormData({
        nom_prenom_client: "",
        telephone: "",
        modeles: "",
        commentaire: "",
        status: "Devis",
        immatriculation: "",
        commentaire_file: "",
      });

      setShowForm(false);
      loadDossiers();
    } catch (error) {
      console.error("Error adding dossier:", error);
      toast.error("An error occurred while adding dossier");
    }
  };

  const startEdit = (dossier) => {
    setEditId(dossier.id);
    setEditFormData({
      id: dossier.id,
      nom_prenom_client: dossier.nom_prenom_client,
      telephone: dossier.telephone,
      immatriculation: dossier.immatriculation || "",
      status: dossier.status,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "telephone" && !/^\d{0,8}$/.test(value)) return;
    if (name === "immatriculation" && !/^[a-zA-Z0-9]{0,18}$/.test(value))
      return;

    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const saveEdit = async () => {
    try {
      if (!editFormData.id || !editFormData.status) {
        toast.error("ID et status sont requis.");
        return;
      }

      const dataToSend = new FormData();
      dataToSend.append("id", editFormData.id);
      dataToSend.append("status", editFormData.status);
      dataToSend.append(
        "nom_prenom_client",
        editFormData.nom_prenom_client || ""
      );
      dataToSend.append("telephone", editFormData.telephone || "");

      // Always send immatriculation, even if empty
      dataToSend.append("immatriculation", editFormData.immatriculation || "");

      // Always send commentaire, even if empty
      dataToSend.append("commentaire", editFormData.commentaire || "");

      // Send file if selected
      if (selectedFile) {
        dataToSend.append("commentaire_file", selectedFile);
      }

      await updateDossier(dataToSend);

      toast.success("Dossier mis à jour avec succès");
      setEditId(null);
      setEditFormData({});
      setSelectedFile(null);
      loadDossiers();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la mise à jour");
      console.error("Update dossier error:", error);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Format date MM/DD/YYYY
    const formattedDate = date.toLocaleDateString("en-US");

    // Format time HH:mm (24h)
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

  // Filter dossiers by search term and status filter
  const filteredDossiers = dossiers.filter((d) => {
    const matchesSearch = d.nom_prenom_client
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? d.status === statusFilter : true;

    const createdAt = new Date(d.date_creation);
    const matchesStart = startDate ? new Date(startDate) <= createdAt : true;
    const matchesEnd = endDate ? createdAt <= new Date(endDate) : true;

    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });

  return (
    <div className="min-h-screen bg-gray-300 text-white font-[Georgia] relative flex flex-col mt-20">
      {/* Navbar full width */}
      <Navbar />
      <ToastContainer />

      <div className="flex flex-1 pt-6 px-4 md:px-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Left: Stats cards + charts */}
        <main className="flex-1 pl-6 md:pl-12">
          <div className="flex h-full flex-row gap-4">
            {/* Search & Filter */}
            <div
              className={`flex-1 transition-all duration-300 ${
                showForm ? "w-1/2" : "w-full"
              }`}
            >
              <h2 className="text-xl text-black font-semibold">
                Liste des dossiers commerciales
              </h2>

              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Rechercher par client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 rounded border text-black flex-1"
                />
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setStatusFilter("")}
                    className={`px-3 py-1 rounded ${
                      statusFilter === ""
                        ? "bg-blue-900 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    Tous
                  </button>
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded ${
                        statusFilter === status
                          ? statusColors[status]
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-white font-semibold transition ${
                      showForm
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-900 hover:bg-blue-800"
                    }`}
                  >
                    {showForm ? (
                      <>
                        <XMarkIcon className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
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
              <br></br>

              {/* Table Section */}

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
                    <th className="border p-2">Agent commercial</th>
                    <th className="border p-2">Date de mise à jours</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDossiers.map((d, i) => (
                    <tr
                      key={i}
                      className="bg-gray-100 hover:bg-gray-400 text-gray-200"
                    >
                      <td className="border p-2 text-black">
                        {formatDateTime(d.date_creation)}
                      </td>
                      <td className="border p-2 text-black">
                        {editId === d.id ? (
                          <input
                            type="text"
                            name="nom_prenom_client"
                            value={editFormData.nom_prenom_client}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          d.nom_prenom_client
                        )}
                      </td>

                      <td className="border p-2 text-black">
                        {editId === d.id ? (
                          <input
                            type="numeric"
                            name="telephone"
                            value={editFormData.telephone}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          d.telephone
                        )}
                      </td>
                      <td className="border p-2 text-black">{d.modeles}</td>
                      {editId === d.id ? (
                        <td className="px-4 py-2 text-black">
                          <input
                            type="text"
                            name="immatriculation"
                            value={editFormData.immatriculation || ""}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 w-full"
                            disabled={editFormData.status !== "Livraison"}
                          />
                        </td>
                      ) : (
                        <td className="px-4 py-2 text-black">
                          {d.immatriculation}
                        </td>
                      )}

                      <td className="border p-2 text-black">
                        {editId === d.id ? (
                          <select
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 w-full"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded ${
                              statusColors[d.status]
                            }`}
                          >
                            {d.status}
                          </span>
                        )}
                      </td>
                      <td className="border p-2 text-black">
                        {editId === d.id ? (
                          <>
                            {/* Textarea for commentaire */}
                            <textarea
                              name="commentaire"
                              value={editFormData.commentaire}
                              onChange={handleEditChange}
                              className="border rounded px-2 py-1 w-full mb-2"
                            />

                            {/* File input for document */}
                            <input
                              type="file"
                              name="commentaire_file"
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={handleFileChange} // defined below
                              className="block w-full text-sm text-gray-500"
                            />
                          </>
                        ) : (
                          <>
                            {/* Show text */}
                            {d.commentaire}

                            {/* Show existing file if any */}
                            {d.commentaire_file && (
                              <a
                                href={`${PICTURE_URL}/${d.commentaire_file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div className="text-black px-3 py-1 rounded transition">
                                  <DocumentArrowDownIcon className="w-5 h-5" />
                                </div>
                              </a>
                            )}
                          </>
                        )}
                      </td>

                      <td className="border p-2 text-black">
                        {d.agent_full_name}
                      </td>
                      <td className="border p-2 text-black">
                        {formatDateTime(d.updated_at)}
                      </td>
                      <td className="border p-2 text-black bg-transparent flex gap-2">
                        {editId === d.id ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="bg-green-600 w-10 h-10 flex justify-center items-center rounded-full"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-red-600 w-10 h-10 flex justify-center items-center rounded-full"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div
                              onClick={() => startEdit(d)}
                              className="bg-gray-600 w-10 h-10 flex justify-center items-center rounded-full cursor-pointer"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </div>
                            {d.status === "Livraison" && (
                              <div
                                onClick={async () => {
                                  try {
                                    const response =
                                      await archiveDossiersManager(d.id);
                                    if (response && response.success) {
                                      toast.success("archived successfully");
                                      loadDossiers();
                                    }
                                  } catch (err) {
                                    console.error("Erreur d’archivage:", err);
                                  }
                                }}
                                className="bg-yellow-700 w-10 h-10 flex justify-center items-center rounded-full cursor-pointer"
                                title="Archiver ce dossier"
                              >
                                <ArchiveBoxIcon className="w-5 h-5" />
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredDossiers.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-black p-4">
                        Aucun dossier trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Form Section */}
            {showForm && (
              <div className="w-1/3 bg-gray-200 p-6 shadow rounded-lg border border-gray-200">
                <h3 className="text-lg text-black font-bold mb-4">
                  Ajouter un dossier
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    name="nom_prenom_client"
                    placeholder="Nom et prénom client"
                    value={formData.nom_prenom_client}
                    onChange={handleChange}
                    className="border p-2 bg-white text-gray-500 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="telephone"
                    placeholder="Téléphone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="border p-2 bg-white text-gray-500 rounded"
                    required
                  />
                  <Select
                    options={carOptions}
                    value={carOptions.find(
                      (opt) => opt.value === formData.modeles
                    )}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...formData,
                        modeles: selectedOption.value,
                      })
                    }
                    placeholder="Select a car model"
                    components={{
                      SingleValue: customSingleValue,
                      Option: customOption,
                    }}
                    isSearchable
                    className="col-span-2"
                    required
                  />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border p-2 bg-white text-gray-500 rounded"
                    required
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                        style={{
                          color:
                            status === "Devis"
                              ? "crimson"
                              : status === "Commande"
                              ? "orange"
                              : status === "Facturation"
                              ? "green"
                              : status === "Livraison"
                              ? "blue"
                              : status === "Blockage"
                              ? "red"
                              : "black",
                        }}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="immatriculation"
                    placeholder="Immatriculation"
                    value={formData.immatriculation}
                    onChange={handleChange}
                    className={`border p-2 bg-white text-gray-500 rounded ${
                      formData.status.toLowerCase() !== "livraison"
                        ? "bg-red text-red cursor-not-allowed"
                        : ""
                    }`}
                    required={formData.status.toLowerCase() === "livraison"}
                    disabled={formData.status.toLowerCase() !== "livraison"}
                  />
                  <textarea
                    name="commentaire"
                    placeholder="Commentaire"
                    value={formData.commentaire}
                    onChange={handleChange}
                    className="col-span-2 border p-2 bg-white text-gray-500 rounded"
                  />
                  <input
                    type="file"
                    name="commentaire_file"
                    accept=".pdf,.doc,.docx,.zip,.png,.jpg"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        commentaire_file: e.target.files[0], // 👈 Capture file object
                      }))
                    }
                  />

                  <div className="col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DossiersPageManager;
