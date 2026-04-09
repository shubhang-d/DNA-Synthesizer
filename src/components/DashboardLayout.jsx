"use client";

import DashboardHeader from './DashboardHeader';

export default function DashboardLayout({ children, sidebarOpen, setSidebarOpen }) {
  return (
    <div className="flex h-screen bg-[#0b0f19]">
      <div className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Sidebar will be rendered by parent */}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
