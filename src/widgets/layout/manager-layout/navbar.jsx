import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cog6ToothIcon, BellIcon, UserIcon } from "@heroicons/react/24/outline";
import { getSessionUser } from "../../../services/auth-services/authService";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionUser = await getSessionUser();
        setUser(sessionUser);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    fetchUser();
  },[]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 w-full bg-black border-b border-gray-700 px-6 py-4 flex justify-between items-center font-[Georgia] shadow-md">
      {/* Left section: Title + Logos */}
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-white tracking-wide whitespace-nowrap">
          CRM Auto Lion
        </div>
        <div className="flex gap-2">
          <img
            src="/img/img-login/citreonLogo.png"
            alt="Citroën"
            className="w-[4rem] h-auto transition-transform duration-300 hover:scale-110"
          />
          <img
            src="/img/img-login/peugeotLogo.png"
            alt="Peugeot"
            className="w-[4rem] h-auto transition-transform duration-300 hover:scale-110"
          />
          <img
            src="/img/img-login/opelLogo.png"
            alt="Opel"
            className="w-[4rem] h-auto transition-transform duration-300 hover:scale-110"
          />
        </div>
      </div>

      {/* Right section: Icons + Profile */}
      <div className="flex items-center gap-4">
        <BellIcon className="w-6 h-6 text-white hover:text-yellow-400 cursor-pointer" />
        <Cog6ToothIcon className="w-6 h-6 text-white hover:text-yellow-400 cursor-pointer" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <UserIcon className="w-6 h-6 text-white hover:text-yellow-400 cursor-pointer" />
            <span className="hidden sm:inline-block text-sm font-semibold text-white">
              {user ? (
                <h1>
                  {user.prenom} {user.nom} ({user.role})
                </h1>
              ) : (
                <p>Loading user info...</p>
              )}
            </span>
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
              <ul className="py-2 text-sm text-gray-700 font-medium">
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition duration-150"
                  >
                    Profil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 hover:bg-gray-100 text-red-600 transition duration-150"
                  >
                    Déconnexion
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
