import React, { useEffect, useState } from "react";
import { PICTURE_URL } from "../../../api/base";
import { userList as fetchUserList } from "../../../services/manager_services/usersService";
import {
  updateUser,
  addUser,
} from "../../../services/manager_services/usersService";
import Sidebar from "../../../widgets/layout/manager-layout/sidebar";
import Navbar from "../../../widgets/layout/manager-layout/navbar";
import {
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function UserList() {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    cin: "",
    nom: "",
    prenom: "",
    telephone: "",

    photoPath: "", // This will store the uploaded image URL/path after upload
    password: "",
    role: "agentC", // default role
  });

  const [activeRole, setActiveRole] = useState("all");

  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetchUserList();
      setUsers(res.message);
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Combine filters, search, and sorting
  useEffect(() => {
    let filtered = [...users];

    // Role filter
    if (activeRole !== "all") {
      filtered = filtered.filter(
        (user) => user.role.toLowerCase() === activeRole
      );
    }

    // Search filter (on nom, prenom, cin, telephone)
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((user) =>
        `${user.nom} ${user.prenom} ${user.cin} ${user.telephone}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
        const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(filtered);
  }, [users, activeRole, searchTerm, sortConfig]);

  // Role background color class for table cell badges
  const roleBgColor = (role) => {
    switch (role.toLowerCase()) {
      case "manager":
        return "bg-red-600 text-white";
      case "agentc":
        return "bg-yellow-300 text-black";
      case "responsablev":
        return "bg-blue-900 text-white";
      default:
        return "bg-gray-200 text-black";
    }
  };

  // Role color class for buttons (background + text)
  const roleBtnColor = (role, isActive) => {
    const baseClasses =
      "px-4 py-2 rounded font-medium transition-colors duration-200 ";
    const activeClasses = " text-white shadow-lg ";

    switch (role) {
      case "manager":
        return (
          baseClasses +
          (isActive
            ? "bg-red-600 hover:bg-red-700" + activeClasses
            : "bg-red-200 border-red-600 text-red-600 hover:bg-red-100")
        );
      case "agentc":
        return (
          baseClasses +
          (isActive
            ? "bg-yellow-600 hover:bg-yellow-700" + activeClasses
            : "bg-yellow-200 border-yellow-600 text-yellow-600 hover:bg-yellow-100")
        );
      case "responsablev":
        return (
          baseClasses +
          (isActive
            ? "bg-blue-900 hover:bg-blue-800" + activeClasses
            : "bg-blue-200 border-blue-600 text-blue-600 hover:bg-blue-100")
        );
      case "all":
      default:
        return (
          baseClasses +
          (isActive
            ? "bg-gray-700 hover:bg-gray-800" + activeClasses
            : "bg-gray-300 border-blue-600 text-blue-600 hover:bg-blue-100")
        );
    }
  };

  const handleFilter = (role) => {
    setActiveRole(role);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditedUser(user); // shallow copy
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleSave = async () => {
    try {
      await updateUser(editedUser);
      setEditingUserId(null);
      setEditedUser({});
      fetchUsers();
    } catch (err) {
      alert("Erreur lors de la mise à jour : " + err.message);
    }
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const formData = new FormData();
    formData.append("cin", form.cin || "");
    formData.append("nom", form.nom || "");
    formData.append("prenom", form.prenom || "");
    formData.append("telephone", form.telephone || "");
    formData.append("password", form.password || "");
    formData.append("role", form.role || "");

    if (form.photo) {
      formData.append("photo", form.photo);
    }

    await addUser(formData);

    toast.success("User added successfully!");

    // Clear form
    setForm({
      cin: "",
      nom: "",
      prenom: "",
      telephone: "",
      password: "",
      role: "",
      photo: null,
    });

    // Optional: re-fetch the user list if shown on same page
    fetchUsers();

    // Reload page after short delay to allow toast to show
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (err) {
    console.error(err);
    setError(err?.response?.data?.error || err.message || "Failed to add user.");
  }
};

  return (
    <div className="min-h-screen bg-gray-300 font-[Georgia]">
      {/* Navbar full width */}
      <Navbar />
      <ToastContainer/>

      {/* Sidebar (icon buttons on left) */}
      <Sidebar />

      {/* Content with padding to prevent overlap with sidebar */}
      <div className="pl-20 pr-4 pt-6 md:pl-24 md:pr-8 mt-16">
        <main className="flex flex-col lg:flex-row gap-6">
          <section className="w-full lg:w-2/3">
            {" "}
            <br />
            <h2 className="text-2xl font-bold">Liste des utilisateurs</h2>
            {/* Filter Buttons */}
            <div className="mb-4 flex flex-wrap gap-4 items-center">
              {["all", "manager", "agentc", "responsablev"].map((role) => (
                <button
                  key={role}
                  onClick={() => handleFilter(role)}
                  className={roleBtnColor(role, activeRole === role)}
                >
                  {role === "all"
                    ? "Tous les Roles"
                    : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-auto w-full max-w-xs px-4 py-2 border border-gray-300 bg-gray-200 text-black rounded focus:outline-none focus:ring-2 focus:ring-black-400"
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto rounded-lg shadow-sm border border-black bg-gray">
                <table className="w-full border text-sm">
                  <thead className="bg-blue-900 text-gray-200 text-gorgia uppercase tracking-wider">
                    <tr>
                      {[
                        { key: "photopath", label: "Image", noSort: true },
                        { key: "nom", label: "Nom" },
                        { key: "prenom", label: "Prénom" },
                        { key: "role", label: "Rôle" },
                        { key: "cin", label: "CIN" },
                        { key: "telephone", label: "Téléphone" },
                      ].map(({ key, label, noSort }) => (
                        <th
                          key={key}
                          onClick={() => !noSort && handleSort(key)}
                          className={`font-gorgia py-2 px-3 text-left cursor-pointer select-none ${
                            noSort ? "cursor-default" : ""
                          }`}
                        >
                          {label}{" "}
                          {!noSort &&
                            (sortConfig.key === key
                              ? sortConfig.direction === "asc"
                                ? "▲"
                                : "▼"
                              : "⇅")}
                        </th>
                      ))}
                      <th className="py-2 px-3 text-left"></th>
                    </tr>
                  </thead>

                  <tbody className="bg-gray-100 font-comic divide-y divide-gray-400 ">
                    {filteredUsers.map(
                      ({
                        id,
                        photopath,
                        nom,
                        prenom,
                        role,
                        cin,
                        telephone,
                      }) => (
                        <tr
                          key={id}
                          className="bg-gray-100 hover:bg-gray-400 text-gray-200"
                        >
                          <td className="px-4 py-3 border p-2 text-black">
                            <img
                              src={
                                photopath
                                  ? `${PICTURE_URL}/${photopath}`
                                  : "/img/default-avatar.png"
                              }
                              alt="User"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </td>
                          <td className="px-4 py-3 border p-2 text-black">
                            {editingUserId === id ? (
                              <input
                                name="nom"
                                value={editedUser.nom}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            ) : (
                              nom
                            )}
                          </td>
                          <td className="px-4 py-3 border p-2 text-black">
                            {editingUserId === id ? (
                              <input
                                name="prenom"
                                value={editedUser.prenom}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            ) : (
                              prenom
                            )}
                          </td>
                          <td className="px-4 py-3 border p-2 text-black">
                            <span
                              className={`px-2 py-1 rounded font-semibold text-sm ${roleBgColor(
                                role
                              )}`}
                            >
                              {role}
                            </span>
                          </td>
                          <td className="px-4 py-3 border p-2 text-black">
                            {cin}
                          </td>
                          <td className="px-4 py-3 border p-2 text-black">
                            {editingUserId === id ? (
                              <input
                                name="telephone"
                                value={editedUser.telephone}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            ) : (
                              telephone || "—"
                            )}
                          </td>
                          <td className="px-4 py-3 space-x-2 whitespace-nowrap border p-2 text-black">
                            {editingUserId === id ? (
                              <>
                                <button
                                  onClick={handleSave}
                                  className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition"
                                >
                                  <CheckCircleIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="bg-gray-700 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs transition"
                                >
                                  <XMarkIcon className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() =>
                                  handleEdit({
                                    id,
                                    nom,
                                    prenom,
                                    role,
                                    cin,
                                    telephone,
                                  })
                                }
                                className=""
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Aucun utilisateur trouvé.</p>
            )}
          </section>

          {/* Form Section Full Width */}
          <aside className="w-1/3 bg-gray-200 p-6 shadow rounded-lg border border-gray-200 mt-16">
            <h2 className="text-lg text-black font-bold mb-4">
              Ajouter un nouveau utilisateur
            </h2>

            {error && <p className="text-red-400 mb-4">{error}</p>}
            {success && <p className="text-green-400 mb-4">{success}</p>}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Form fields... */}

              {/* CIN */}
              <div>
                <label
                  htmlFor="cin"
                  className="block text-sm font-medium text-black mb-1"
                >
                  CIN <span className="text-red-500">*</span>
                </label>
                <input
                  id="cin"
                  name="cin"
                  placeholder="CIN"
                  value={form.cin}
                  onChange={handleChange}
                  required
                  className="border p-2 bg-white text-gray-500 rounded"
                />
              </div>

              {/* Nom */}
              <div>
                <label
                  htmlFor="nom"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  id="nom"
                  name="nom"
                  placeholder="Nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="border p-2 bg-white text-gray-500 rounded"
                />
              </div>

              {/* Prénom */}
              <div>
                <label
                  htmlFor="prenom"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  placeholder="Prénom"
                  value={form.prenom}
                  onChange={handleChange}
                  required
                  className="border p-2 bg-white text-gray-500 rounded"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label
                  htmlFor="telephone"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Téléphone
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  placeholder="Téléphone"
                  value={form.telephone}
                  onChange={handleChange}
                  className="border p-2 bg-white text-gray-500 rounded"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="border p-2 bg-white text-gray-500 rounded"
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Rôle <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="border p-2 bg-white text-gray-500 rounded"
                >
                  <option value="agentC">Agent Commercial</option>
                  <option value="responsableV">Responsable Vente</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, photo: e.target.files[0] }))
                  }
                  className="border p-2 bg-white text-gray-500 rounded"
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white font-semibold rounded hover:bg-gray-700 transition"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </aside>
        </main>
      </div>
    </div>
  );
}
