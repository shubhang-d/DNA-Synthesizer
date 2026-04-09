 "use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Dna,
  Brain,
  Search,
  Library,
  FlaskConical,
  Upload,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "DNA Sequence Generator", href: "/dna-generator", icon: Dna },
  { name: "Diffusion Model Training", href: "/model-training", icon: Brain },
  { name: "Regulatory Element Analyzer", href: "/analyzer", icon: Search },
  { name: "Synthetic DNA Library", href: "/library", icon: Library },
  { name: "Experiment Results", href: "/experiments", icon: FlaskConical },
  { name: "Model Upload", href: "/upload", icon: Upload },
  { name: "Analytics & Insights", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { data: session, status } = useSession();

  return (
    <aside className={`fixed left-0 top-0 h-screen ${sidebarOpen ? 'w-64' : 'w-20'} bg-[#111827]/95 backdrop-blur-xl border-r border-gray-700/50 flex flex-col justify-between p-4 shadow-2xl shadow-cyan-500/10 transition-all duration-300 ease-in-out`}>
      <div className="absolute inset-0 border-r-2 border-transparent bg-gradient-to-b from-cyan-400/30 via-purple-400/30 to-pink-400/30 bg-clip-border opacity-50"></div>

      <div className="relative z-10 mb-4 flex items-center justify-between">
        {sidebarOpen && (
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent hover:from-cyan-200 hover:via-purple-200 hover:to-pink-200 transition-all duration-300 animate-pulse">
            DNA Diffusion
          </Link>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto relative z-10">
        <div className="flex flex-col space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center ${sidebarOpen ? 'gap-3 py-2 px-3' : 'justify-center py-3 px-2'} rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:via-purple-500/20 hover:to-pink-500/20 hover:border hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 relative overflow-hidden`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-300 transition-all duration-300 relative z-10 group-hover:animate-pulse" />
                {sidebarOpen && (
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300 relative z-10 font-medium text-sm">
                    {item.name}
                  </span>
                )}

                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 ${sidebarOpen ? 'h-6' : 'h-8'} bg-gradient-to-b from-cyan-400 to-purple-400 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-4 relative z-10">
        <div className={`group bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-400/30 rounded-2xl ${sidebarOpen ? 'p-4' : 'p-2'} backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20`}>
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-pink-400/40 bg-clip-border opacity-0 group-hover:opacity-100 animate-border-glow transition-opacity duration-500"></div>

          <div className="relative z-10">
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300 animate-neon-glow">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors duration-300">Researcher</p>
                    <p className="text-xs text-gray-400 group-hover:text-purple-300 transition-colors duration-300">DNA Lab</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-xs text-green-400 font-semibold animate-pulse">Model Operational</span>
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300 animate-neon-glow">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
