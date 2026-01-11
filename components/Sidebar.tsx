"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  MessageSquare,
  Sparkles,
  Settings,
  Zap,
  DownloadCloud,
  StickyNote,
  Library,
  Home,
  ChevronLeft 
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tools', href: '/dashboard/tools', icon: Wrench },
  { name: 'Assistant', href: '/dashboard/story', icon: MessageSquare },
  { name: 'Study Sync', href: '/dashboard/recall', icon: Zap }, 
  { name: 'My Knowledge', href: '/dashboard/recall/bank', icon: Library },
  { name: 'My Downloads', href: '/dashboard/downloads', icon: DownloadCloud },
  { name: 'Notebook', href: '/dashboard/notes', icon: StickyNote },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-[#0f172a] border-r border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/5 blur-[50px] pointer-events-none" />

      {/* Brand Logo */}
      <div className="relative z-10 flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
          <Sparkles className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
        <span className="font-bold text-lg md:text-xl tracking-tight text-white uppercase">
          Edu<span className="text-blue-500">Flux</span>
        </span>
      </div>

      {/* Unified Navigation - Removed flex-1 to keep sections together */}
      <nav className="relative z-10 space-y-1 md:space-y-2">
        
        {/* Back to Home Button */}
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 mb-2 text-xs font-bold text-slate-500 hover:text-blue-400 transition-all group uppercase tracking-widest border-b border-slate-800/50 pb-4"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <span>Back to Home</span>
          <ChevronLeft className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
        </Link>

        {/* Main Menu Items */}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 font-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
              }`} />
              <span className="text-sm md:text-base tracking-tight">{item.name}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-200 shadow-sm" />
              )}
            </Link>
          );
        })}

        {/* Settings - Now in continuity without the border-t */}
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
            pathname === '/dashboard/settings' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 font-medium'
          }`}
        >
          <Settings className={`w-5 h-5 transition-colors ${
            pathname === '/dashboard/settings' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
          }`} />
          <span className="text-sm md:text-base tracking-tight">Settings</span>
        </Link>
      </nav>

      {/* User Profile Area - Kept at bottom but without the top line */}
      <div className="relative z-10 mt-auto pt-6">
        <div className="flex items-center gap-3 px-3 py-3 bg-slate-800/40 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9 border-2 border-slate-700 shadow-sm"
              }
            }}
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-slate-100 truncate">
              My Profile
            </span>
            <span className="text-[10px] text-slate-500 truncate font-black uppercase tracking-[0.1em]">
              Scholar Account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}