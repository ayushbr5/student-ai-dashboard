"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  MessageSquare,
  Sparkles,
  Settings,
  Brain,
  DownloadCloud,
  StickyNote
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tools', href: '/dashboard/tools', icon: Wrench },
  { name: 'Assistant', href: '/dashboard/story', icon: MessageSquare },
  { name: 'Quiz Hub', href: '/dashboard/quiz', icon: Brain },
  { name: 'My Downloads', href: '/dashboard/downloads', icon: DownloadCloud },
  { name: 'Notes', href: '/dashboard/notes', icon: StickyNote },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // UPDATED: Changed bg-white to bg-slate-900 and border color
    <div className="flex flex-col h-full p-4 md:p-6 bg-[#0f172a] border-r border-slate-800 shadow-2xl">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
          <Sparkles className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
        <span className="font-bold text-lg md:text-xl tracking-tight text-white">
          StudentAI
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 md:space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 font-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
              <span className="text-sm md:text-base">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings & Profile */}
      <div className="pt-6 mt-6 border-t border-slate-800 space-y-2">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            pathname === '/dashboard/settings' 
              ? 'bg-slate-800 text-blue-400' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </Link>

        {/* User Profile Area - Dark Variant */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 rounded-2xl border border-slate-800 mt-2">
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8"
              }
            }}
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-slate-100 truncate">
              My Profile
            </span>
            <span className="text-[10px] text-slate-500 truncate font-medium uppercase tracking-wider">Student Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}