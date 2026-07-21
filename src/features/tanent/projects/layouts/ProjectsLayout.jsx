import React from "react";
import { Outlet } from "react-router-dom";

export default function ProjectsLayout() {
  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}