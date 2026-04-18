 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Dna,
  Brain,
  Search,
  Library,
  Upload,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "DNA Sequence Generator", href: "/dashboard/dna-generator", icon: Dna },
  { name: "Diffusion Model Training", href: "/dashboard/model-training", icon: Brain },
  { name: "Regulatory Motif Analyzer", href: "/dashboard/analyzer", icon: Search },
  { name: "Synthetic DNA Library", href: "/dashboard/library", icon: Library },
  { name: "Model Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Analytics & Insights", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const researcherName = session?.user?.name || "Researcher";
  const researcherLab = session?.user?.email || "Lab 04";

  return (
    <aside className={`fixed left-0 top-0 h-screen z-50 ${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 transition-all duration-300 ease-in-out`}>
      <div className="relative z-10 mb-6 flex items-center justify-between">
        {sidebarOpen && (
          <Link href="/" className="text-lg font-bold text-slate-100 uppercase tracking-wide">
            DNA Diffusion
          </Link>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 no-scrollbar">
        <div className="flex flex-col space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center ${sidebarOpen ? 'gap-3 py-2.5 px-3' : 'justify-center py-3 px-2'} rounded-md transition-colors duration-200 relative ${active ? 'bg-indigo-600/15 text-white border border-indigo-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'}`}
                aria-current={active ? "page" : undefined}
                title={!sidebarOpen ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium text-sm truncate">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-4 relative z-10 pt-4 border-t border-slate-800">
        <div className={`bg-slate-800/50 rounded-lg ${sidebarOpen ? 'p-3' : 'p-2 flex justify-center'} transition-all duration-300`}>
          <div className="relative z-10">
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-600/20 text-indigo-400 rounded-md flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-slate-200 truncate">{researcherName}</p>
                    <p className="text-xs text-slate-500 truncate">{researcherLab}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-slate-400 font-medium">Model Operational</span>
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-indigo-600/20 text-indigo-400 rounded-md flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
