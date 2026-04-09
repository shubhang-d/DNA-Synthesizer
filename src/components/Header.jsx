"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const sess = useSession();
  const session = sess?.data;
  const status = sess?.status;

  return (
    <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 text-white">
      <Link href="/" className="font-semibold text-lg text-white">
        DNA Diffusion Platform
      </Link>
      <div className="space-x-6 flex items-center text-sm font-medium text-slate-300">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <Link href="/dashboard" className="hover:text-white transition-colors">Platform</Link>
        <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
        {status === "authenticated" ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-white"
          >
            Sign out
          </button>
        ) : (
          <div className="flex items-center gap-2 ml-4">
            <Link href="/auth/login" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors">
              Log in
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-white">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
