
import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* RIGHT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <Topbar />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
