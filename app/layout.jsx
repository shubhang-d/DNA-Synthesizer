"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import Providers from "../src/components/Providers";
import Sidebar from "../src/components/Sidebar";
import DashboardLayout from "../src/components/DashboardLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0f19] text-white`}
      >
        <Providers>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <DashboardLayout sidebarOpen={sidebarOpen}>
            {children}
          </DashboardLayout>
        </Providers>
      </body>
    </html>
  );
}
