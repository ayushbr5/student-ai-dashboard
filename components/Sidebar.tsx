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
  Library 
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

      {/* Brand Logo with Glow */}
      <div className="relative z-10 flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
          <Sparkles className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
        <span className="font-bold text-lg md:text-xl tracking-tight text-white uppercase">
          Student<span className="text-blue-500">AI</span>
        </span>
      </div>

      {/* Navigation Links - Fixed height, no scrolling */}
      <nav className="relative z-10 flex-1 space-y-1 md:space-y-2">
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
      </nav>

      {/* Settings & Profile Section */}
      <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 space-y-2">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            pathname === '/dashboard/settings' 
              ? 'bg-slate-800 text-blue-400' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm tracking-tight">Settings</span>
        </Link>

        {/* User Profile Area */}
        <div className="flex items-center gap-3 px-3 py-3 bg-slate-800/40 rounded-2xl border border-slate-800 mt-2 backdrop-blur-sm">
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