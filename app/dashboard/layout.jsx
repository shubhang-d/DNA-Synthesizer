"use client";

import { useState } from "react";
import Sidebar from "../../src/components/Sidebar";
import DashboardLayout from "../../src/components/DashboardLayout";

export default function DashboardRootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        {children}
      </DashboardLayout>
    </>
  );
}
