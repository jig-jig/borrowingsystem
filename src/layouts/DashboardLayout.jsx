import React from 'react';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="bg-white min-h-screen w-full relative">
      {/* Content Injection Canvas */}
      <Outlet />
    </div>
  );
}
