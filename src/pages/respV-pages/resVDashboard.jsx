import React, { useEffect } from "react";
import NavbarResp from "../../widgets/layout/resp-layout/navbar-resp"
import SidebarResp from "../../widgets/layout/resp-layout/sidebar-resp"

import { ToastContainer } from "react-toastify";

function ResVDashboard() {


 
 

  useEffect(() => {
 
  }, []);

 

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
