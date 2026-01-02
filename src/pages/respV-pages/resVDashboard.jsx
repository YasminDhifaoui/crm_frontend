import React, { useEffect, useState } from "react";
import { Typography, Card, Button, Input } from "@material-tailwind/react";
import { ArrowUpIcon, ClockIcon } from "@heroicons/react/24/outline";
import CircularProgress from "../../widgets/statics/CircularProgress";
import CurrentDateTime from "../../widgets/layout/CurrentDateTime";
import { getSessionUser } from "../../services/auth-services/authService";
import NavbarResp from "../../widgets/layout/resp-layout/navbar-resp"
import SidebarResp from "../../widgets/layout/resp-layout/sidebar-resp"

import { toast, ToastContainer } from "react-toastify";

function ResVDashboard() {
  const [message, setMessage] = useState("");


 
 

  useEffect(() => {
 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    try {
     
    } catch (err) {
      console.error("Error saving objective:", err);
      setMessage("❌ Failed to save objective.");
      toast.error("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 text-white font-[Georgia] relative flex flex-col mt-20">
      <NavbarResp/>
      <ToastContainer />
      <div className="flex flex-1 pt-6 px-4 md:px-8">
        <SidebarResp/>
        <main className="flex-1 pl-6 md:pl-12">
          <div className="text-black bg-white rounded grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 mb-12 mt-8">
            Bienvenu 
          
          </div>
        </main>

        
      </div>
    </div>
  );
}

export default ResVDashboard;
