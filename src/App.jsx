import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./api/ProtectedRoute";
import TestSession from "./pages/TestSession";

import Login from "./pages/auth-pages/login";
import Logout from "./pages/auth-pages/logout";

import ManagerDashboard from "./pages/manager-pages/managerDashboard";
import { UserList } from "./pages/manager-pages/usersManagement/usersList";
import DossiersPageManager from "./pages/manager-pages/dossiersManagement/listDossier-manager";
import ArchiveManager from "./pages/manager-pages/dossiersManagement/listArchive-manager";

import AgentCDashboard from "./pages/agentC-pages/agentCDashboard";
import ListDossierAgent from "./pages/agentC-pages/dossiers-agentManagement/listDossier-agent";
import ArchiveAgent from "./pages/agentC-pages/dossiers-agentManagement/listArchive-agent";

import ResVDashboard from "./pages/respV-pages/resVDashboard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Redirect default path "/" to "/login" */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/managerDashboard/test-session"
            element={<TestSession />}
          />

          {/* Manager routes */}
          <Route path="/managerDashboard/logout" element={<Logout />} />

          <Route
            path="/managerDashboard"
            element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerDashboard/usersList"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerDashboard/dossiersList"
            element={
              <ProtectedRoute>
                <DossiersPageManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerDashboard/archiveList"
            element={
              <ProtectedRoute>
                <ArchiveManager />
              </ProtectedRoute>
            }
          />

          {/* AgentC routes */}
          <Route
            path="/agentCDashboard"
            element={
              <ProtectedRoute>
                <AgentCDashboard />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/agentCDashboard/logout" element={<Logout />} />
          <Route
            path="/agentCDashboard/ListDossierAgent"
            element={
              <ProtectedRoute>
                <ListDossierAgent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agentCDashboard/ArchiveAgent"
            element={
              <ProtectedRoute>
                <ArchiveAgent />
              </ProtectedRoute>
            }
          />

          {/* ResV routes */}
          <Route path="/resVDashboard/logout" element={<Logout />} />

          <Route
            path="/resVDashboard"
            element={
              <ProtectedRoute>
                <ResVDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
