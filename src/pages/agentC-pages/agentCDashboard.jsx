import React, { useEffect, useState } from "react";
import { Typography, Card, Button, Input } from "@material-tailwind/react";
import { ArrowUpIcon, ClockIcon } from "@heroicons/react/24/outline";
import CircularProgress from "../../widgets/statics/CircularProgress";
import CurrentDateTime from "../../widgets/layout/CurrentDateTime";
import NavbarAgent from "../../widgets/layout/agentC-layout/navbar-agent";
import SidebarAgent from "../../widgets/layout/agentC-layout/sidebar-agent";
import { getSessionUser } from "../../services/auth-services/authService";
import {
  getAgentObjective,
  setAgentObjective,
  updateRealizedObjective,
  getAgentProgress,
} from "../../services/agent-services/objectifAgentService"; // you'll create these functions
import { toast, ToastContainer } from "react-toastify";

function AgentCDashboard() {
  const [user, setUser] = useState(null);
  const [goal, setGoal] = useState("");
  const [currentGoal, setCurrentGoal] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState({ realized: 0, objective: 0 });

  const today = new Date();
  const dayOfMonth = today.getDate();
  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  const canEdit = dayOfMonth >= 1 && dayOfMonth <= 30;

  const fetchUserAndGoal = async () => {
    try {
      const sessionUser = await getSessionUser();
      setUser(sessionUser);

      if (sessionUser) {
        const res = await getAgentObjective(currentMonth);
        if (res?.objective) {
          setCurrentGoal(res.objective);
          setGoal(res.objective);
        }
        await updateRealizedObjective();
      }
    } catch (error) {
      console.error("Failed to load user/objective:", error);
    }
  };
  const fetchUserAndProgress = async () => {
    try {
      const sessionUser = await getSessionUser();
      setUser(sessionUser);

      const progressData = await getAgentProgress();
      if (progressData.success && progressData.objective > 0) {
        setProgress(progressData);

        const percent = Math.min(
          100,
          Math.round((progressData.realized / progressData.objective) * 100)
        );
      } else {
        setProgress({ realized: 0, objective: 0 });
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  useEffect(() => {
    fetchUserAndProgress();
    fetchUserAndGoal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal || isNaN(goal)) {
      setMessage("⚠️ Please enter a valid number.");
      return;
    }

    try {
      const res = await setAgentObjective(parseFloat(goal), currentMonth); // ✅ fixed
      toast.success("Objectif saved successfully !");
      setCurrentGoal(goal);
      await updateRealizedObjective(); // update backend
      await fetchUserAndProgress(); // 💡 refresh UI data
    } catch (err) {
      console.error("Error saving objective:", err);
      setMessage("❌ Failed to save objective.");
      toast.error("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 text-white font-[Georgia] relative flex flex-col mt-20">
      <NavbarAgent />
      <ToastContainer />
      <div className="flex flex-1 pt-6 px-4 md:px-8">
        <SidebarAgent />
        <main className="flex-1 pl-6 md:pl-12">
          <div className="text-black bg-white rounded grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 mb-12 mt-8">
            Bienvenu !{" "}
            {user ? (
              <h1>
                {user.prenom} {user.nom} ({user.role} )
              </h1>
            ) : (
              <p>Loading user info...</p>
            )}{" "}
            you have dossiers non facturee ur goal is ( {goal})<br></br>
            ur currentGoal is {currentGoal}
          </div>
        </main>

        <aside className="w-64 ml-8">
          <CurrentDateTime />
          <div className="mt-6">
            <CircularProgress
              realized={progress.realized}
              objective={progress.objective}
            /><br></br>
            <div className="font-bold text-sm text-black mb-2">Total Objectif : {goal}</div>
            <div className="mt-6 bg-white text-black p-4 rounded-lg shadow">
              <h2 className="font-bold text-sm mb-2">
                🎯 Monthly Objective ({currentMonth})
              </h2>

              {currentGoal && !canEdit ? (
                <p>
                  ✅ Your objective: <strong>{currentGoal}</strong>
                </p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Input
                    label="Set your goal"
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    disabled={!canEdit}
                    required
                  />
                  <br></br>
                  <Button
                    type="submit"
                    size="sm"
                    color="green"
                    disabled={!canEdit}
                    className="mt-2"
                  >
                    Save
                  </Button>
                </form>
              )}

              {message && <p className="text-sm mt-2">{message}</p>}
              {!canEdit && (
                <p className="text-xs text-red-600 mt-2">
                  ⛔ You can only update your objective between the 1st and 5th.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AgentCDashboard;
