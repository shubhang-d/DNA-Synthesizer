"use client";

import { User, Brain, Settings, CreditCard, LogOut, Hexagon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import ProfileModal from './ProfileModal';

export default function LandingHeader() {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-6 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Hexagon className="w-6 h-6 text-indigo-400" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">DNA Platform</span>
      </Link>

      <div className="flex items-center space-x-4">
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
                        {session?.user?.name || "Demo Node"}
                   </div>
                   <div className="text-xs text-slate-400 tracking-tight leading-tight mt-0.5">
                      {session?.user?.email || "researcher@dnadiffusion.com"}
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
                       <Link href="/dashboard" className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50">
                           <Hexagon className="w-4 h-4 mr-3 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                           <span className="text-sm font-bold text-slate-200 group-hover:text-white tracking-tight leading-tight">Access Dashboard</span>
                       </Link>
                       <button 
                         onClick={() => { setSetupOpen(true); setProfileOpen(false); }}
                         className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50"
                       >
                           <User className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
                           <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 tracking-tight leading-tight">Profile Settings</span>
                       </button>
                       <button className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50">
                           <Brain className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
                           <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 tracking-tight leading-tight">Model</span>
                           <span className="ml-auto text-xs font-medium rounded-md py-1 px-2 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 tracking-tight">
                               DNA v2.0
                           </span>
                       </button>
                       <button className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50">
                           <CreditCard className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
                           <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 tracking-tight leading-tight">Subscription</span>
                           <span className="ml-auto text-xs font-medium rounded-md py-1 px-2 text-purple-400 bg-purple-500/10 border border-purple-500/20 tracking-tight">
                               PRO
                           </span>
                       </button>
                       <button className="w-full flex items-center p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-slate-600/50">
                           <Settings className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
                           <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 tracking-tight leading-tight">Settings</span>
                       </button>
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
