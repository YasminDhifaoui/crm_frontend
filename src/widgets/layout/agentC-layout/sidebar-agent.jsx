import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
   ArchiveBoxIcon

} from "@heroicons/react/24/outline";

// Sidebar routes data
const SidebarRoutes = [
  {
    title: "Manager",
    layout: "/agentCDashboard",
    pages: [
      {
        name: "Dashboard",
        path: "/",
        icon: <HomeIcon className="h-6 w-6 text-white" />,
        color: "bg-gray-600",
      },
    
      {
        name: "Dossiers",
        path: "/ListDossierAgent",
        icon: <EnvelopeIcon className="h-6 w-6 text-white" />,
        color: "bg-green-900",
      },
     /* {
        name: "Leads",
        path: "/leads",
        icon: <DocumentIcon className="h-6 w-6 text-white" />,
        color: "bg-purple-900",
      },*/
       {
        name: "Archive",
        path: "/ArchiveAgent",
        icon: < ArchiveBoxIcon className="h-6 w-6 text-white" />,
        color: "bg-yellow-700",
      },
      {
        name: "Déconnexion",
        path: "/logout",
        icon: <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />,
        color: "bg-red-800",
      },
    ],
  },
];

export default function SidebarAgent({ routes }) {
  return (
    <aside className="fixed top-1/2 left-4 transform -translate-y-1/2 z-50 flex flex-col gap-4 font-[Georgia]">
      {routes[0].pages.map(({ name, path, icon, color }) => (
        <NavLink
          key={name}
          to={`${routes[0].layout}${path}`}
          className={({ isActive }) =>
            `w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 group ${
              isActive ? "ring-4 ring-white" : ""
            } ${color}`
          }
          title={name}
        >
          {icon}
          <span className="sr-only">{name}</span>
        </NavLink>
      ))}
    </aside>
  );
}

SidebarAgent.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

SidebarAgent.defaultProps = {
  routes: SidebarRoutes,
};
