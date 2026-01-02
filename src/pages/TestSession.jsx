// TestSession.js
import React, { useEffect, useState } from "react";
import { test } from "../services/test"; // Adjust the import path as necessary
import Sidebar from "../widgets/layout/manager-layout/sidebar";
import Navbar from "../widgets/layout/manager-layout/navbar";
export default function TestSession() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    test()
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
       <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 xl:ml-72 p-6">
        <Navbar />
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Session Test</h2>
      {error && <p className="text-red-500">Error: {error}</p>}
      {user ? (
        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>No user in session.</p>
      )}
    </div>
      </div>
    </div>
  );
}
