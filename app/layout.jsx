"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Providers from "../src/components/Providers";
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0f19] text-white`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
