 "use client";

import { useState } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function DashboardHeader({ sidebarOpen, setSidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, message: 'New DNA sequence generated', time: '2 min ago', type: 'success' },
    { id: 2, message: 'Model training completed', time: '1 hr ago', type: 'info' },
  ];

  return (
    <header className="flex items-center justify-between p-6 bg-[#111827]/95 backdrop-blur-xl border-b border-gray-700/50 shadow-xl shadow-cyan-500/10 sticky top-0 z-40">
      <div className="flex items-center w-72 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4" />
        <input
          type="text"
          placeholder="Search DNA sequences, experiments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 outline-none"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-200 relative group"
          >
            <Bell className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 relative z-10" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/50 animate-pulse">3</span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-cyan-500/20 py-3 px-4 max-h-96 overflow-y-auto z-50">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </h3>
              {notifications.map((notif) => (
                <div key={notif.id} className="flex gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition-colors duration-200 border-b border-gray-800/50 last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`} />
                  <div>
                    <p className="text-sm font-medium text-white">{notif.message}</p>
                    <p className="text-xs text-gray-400">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-700/50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300 animate-neon-glow">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-white">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-gray-400">Researcher</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-cyan-500/20 py-2 px-4 z-50">
              <div className="border-b border-gray-700/50 pb-3 mb-3">
                <p className="text-sm font-semibold text-white">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{session?.user?.email}</p>
              </div>
              <button className="w-full text-left p-2 rounded-xl hover:bg-gray-800/50 transition-colors duration-200 text-white text-sm font-medium flex items-center gap-2">
                Profile Settings
              </button>
              <button className="w-full text-left p-2 rounded-xl hover:bg-gray-800/50 transition-colors duration-200 text-white text-sm font-medium flex items-center gap-2">
                Account
              </button>
              <button className="w-full text-left p-2 rounded-xl hover:bg-gray-800/50 transition-colors duration-200 text-white text-sm font-medium flex items-center gap-2" onClick={() => signOut()}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

