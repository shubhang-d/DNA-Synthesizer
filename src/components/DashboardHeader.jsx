"use client";

import { useState, useMemo } from "react";
import { Search, Bell, User, Settings, LogOut, Brain, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ProfileModal from "./ProfileModal";
import { getJSON } from "../lib/userStorage";

function useNotifications(session) {
  return useMemo(() => {
    try {
      const library = getJSON(session, "dna_library", []);
      const batches = {};
      for (const e of library) {
        const key = (e.generatedAt ?? "").slice(0, 19);
        if (!batches[key]) batches[key] = { key, count: 0, cellType: e.cellType, ts: e.generatedAt };
        batches[key].count++;
      }
      return Object.values(batches)
        .sort((a, b) => b.key.localeCompare(a.key))
        .slice(0, 5)
        .map((b) => ({
          id: b.key,
          message: `${b.count} ${b.cellType} sequence${b.count > 1 ? "s" : ""} generated`,
          time: new Date(b.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "success",
        }));
    } catch {
      return [];
    }
  }, [session]);
}

export default function DashboardHeader() {
  const [searchQuery, setSearchQuery]       = useState("");
  const { data: session }                   = useSession();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen]       = useState(false);
  const [setupOpen, setSetupOpen]           = useState(false);

  const notifications = useNotifications(session);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="flex items-center w-72 relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3" />
        <input
          type="text"
          placeholder="Search sequences…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-3">
        {session && (
          <>
            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => { setNotificationsOpen((o) => !o); setProfileOpen(false); }}
                className="p-2 rounded-md hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-slate-400 hover:text-slate-200" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-200">Notifications</h3>
                    <button onClick={() => setNotificationsOpen(false)}>
                      <X className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No activity yet — generate some sequences.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-emerald-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{n.message}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-slate-700" />
          </>
        )}

        {/* Profile / Sign in */}
        {!session ? (
          <Link
            href="/auth/login"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            Sign In
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => { setProfileOpen((o) => !o); setNotificationsOpen(false); }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 hover:bg-slate-800 transition-all"
            >
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-slate-100 leading-tight">{session.user?.name ?? "Researcher"}</p>
                <p className="text-xs text-slate-400 leading-tight mt-0.5">{session.user?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-[2px] shrink-0">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 p-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700/60 rounded-2xl shadow-xl z-50">
                <div className="px-3 py-2 mb-1">
                  <p className="text-sm font-semibold text-white truncate">{session.user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                </div>
                <div className="h-px bg-slate-700 mb-1" />
                <button
                  onClick={() => { setSetupOpen(true); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700/60 rounded-xl text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" /> Profile Settings
                </button>
                <Link
                  href="/dashboard/model-training"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700/60 rounded-xl text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <Brain className="w-4 h-4" /> Model
                  <span className="ml-auto text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">v2.0</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700/60 rounded-xl text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <div className="h-px bg-slate-700 my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ProfileModal
        isOpen={setupOpen}
        onClose={() => setSetupOpen(false)}
        initialData={session?.user}
      />
    </header>
  );
}
