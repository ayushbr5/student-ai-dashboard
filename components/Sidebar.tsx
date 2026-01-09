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
  LogOut
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const menuItems = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Tools', 
    href: '/dashboard/tools', 
    icon: Wrench 
  },
  { 
    name: 'Assistant', 
    href: '/dashboard/story', // This is your Math Chat page
    icon: MessageSquare 
  },
  { 
  name: 'Quiz Hub', 
  href: '/dashboard/quiz', 
  icon: Brain 
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full p-6 bg-white border-r border-slate-200">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Sparkles className="text-white" size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">
          StudentAI
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <item.icon size={20} />
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings & Profile */}
      <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            pathname === '/dashboard/settings' 
              ? 'bg-slate-100 text-blue-600' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
        
        <div className="flex items-center gap-3 px-4 py-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-slate-800 truncate">
              My Profile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}