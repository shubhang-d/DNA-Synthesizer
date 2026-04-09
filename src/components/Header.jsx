"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const sess = useSession();
  const session = sess?.data;
  const status = sess?.status;

  return (
    <nav className="max-w-3xl mx-auto flex items-center justify-between p-4 bg-blue-600 text-white">
      <Link href="/" className="font-bold text-xl">
        AI Driver Safety
      </Link>
      <div className="space-x-4 flex items-center">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/live-risk">Live Risk Detection</Link>
        <Link href="/analytics">Analytics</Link>
        <Link href="/alerts">Alert History</Link>
        <Link href="/predictor">Accident Predictor</Link>
        <Link href="/model-upload">Model Upload</Link>
        {status === "authenticated" ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-4"
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/auth/login" className="ml-4">
              Login
            </Link>
            <Link href="/auth/register" className="ml-2">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
