 "use client";

import { useState } from 'react';
import { Search, Bell, User, Settings, CreditCard, FileText, LogOut, Brain } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import ProfileModal from './ProfileModal';

export default function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);

  const notifications = [
    { id: 1, message: 'New DNA sequence generated', time: '2 min ago', type: 'success' },
    { id: 2, message: 'Model training completed', time: '1 hr ago', type: 'info' },
  ];

  return (
    <header className="flex items-center justify-between p-6 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="flex items-center w-80 relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-4" />
        <input
          type="text"
          placeholder="Search DNA sequences, experiments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
        />
      </div>

      <div className="flex items-center space-x-4">
        {session && (
          <>
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-md hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-slate-400 hover:text-slate-200" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900"></span>
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl shadow-black/20 py-2 z-50 animate-in fade-in zoom-in-95 origin-top-right">
                  <h3 className="font-semibold text-sm text-slate-200 px-4 py-2 border-b border-slate-700 mb-1 flex items-center gap-2">
                    Notifications
                  </h3>
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${notif.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-200">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-800"></div>
          </>
        )}

        <div className="relative group">
          {!session ? (
            <Link href="/auth/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors duration-200 text-sm">
              Sign In
            </Link>
          ) : (
            <>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-6 p-2 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 hover:bg-slate-800 hover:shadow-sm transition-all duration-200 focus:outline-none"
              >
                <div className="text-left flex-1 pl-2 hidden md:block">
                   <div className="text-sm font-medium text-slate-100 tracking-tight leading-tight">
                        {session?.user?.name || "Eugene An"}
                   </div>
                   <div className="text-xs text-slate-400 tracking-tight leading-tight mt-0.5">
                      {session?.user?.email || "eugene@kokonutui.com"}
                   </div>
                </div>
                <div className="relative">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-[2px]">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 overflow-hidden">
                         <User className="w-4 h-4" />
                      </div>
                   </div>
                </div>
              </button>
              
              <div className={`absolute -right-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none hidden md:block ${profileOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                 <svg width="12" height="24" viewBox="0 0 12 24" fill="none" className={`transition-all duration-200 ${profileOpen ? "text-indigo-400 scale-110" : "text-slate-500 group-hover:text-slate-300"}`}>
                    <path d="M2 4C6 8 6 16 2 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                 </svg>
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 p-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700/60 rounded-2xl shadow-xl shadow-black/40 origin-top-right animate-in fade-in zoom-in-95 z-50">
                   <div className="space-y-1">
                       <button 
                         onClick={() => { setSetupOpen(true); setProfileOpen(false); }}
                         className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50"
                       >
                           <User className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
                           <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 tracking-tight leading-tight">Profile Settings</span>
                       </button>
                       <Link href="/dashboard/model-training" className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50">
                           <Brain className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
                           <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 tracking-tight leading-tight">Model</span>
                           <span className="ml-auto text-xs font-medium rounded-md py-1 px-2 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 tracking-tight">
                               DNA v2.0
                           </span>
                       </Link>
                       <Link href="/dashboard/settings" className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50">
                           <CreditCard className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
                           <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 tracking-tight leading-tight">Subscription</span>
                           <span className="ml-auto text-xs font-medium rounded-md py-1 px-2 text-purple-400 bg-purple-500/10 border border-purple-500/20 tracking-tight">
                               PRO
                           </span>
                       </Link>
                       <Link href="/dashboard/settings" className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50">
                           <Settings className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
                           <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 tracking-tight leading-tight">Settings</span>
                       </Link>
                       <Link href="/dashboard/experiments" className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50">
                           <FileText className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
                           <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 tracking-tight leading-tight">Experiment Reports</span>
                       </Link>
                   </div>
                   
                   <div className="my-3 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                   <button 
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 p-3 bg-red-500/10 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all border border-transparent hover:border-red-500/30 group"
                   >
                      <LogOut className="w-4 h-4 group-hover:text-red-400" />
                      <span className="text-sm font-medium group-hover:text-red-400">Sign Out</span>
                   </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ProfileModal 
        isOpen={setupOpen} 
        onClose={() => setSetupOpen(false)} 
        initialData={session?.user} 
      />

    </header>
  );
}

