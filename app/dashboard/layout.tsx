import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">

      {/* 1. Desktop Sidebar - Fixed Left */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-white border-r border-slate-200">
        <Sidebar />
      </aside>

      {/* 2. Main Content Area - Responsive padding for Desktop Sidebar */}
      <main className="md:pl-72 flex-1 flex flex-col h-full relative w-full">

        {/* 3. Mobile Navigation Header - Only visible on small screens */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-[100] w-full shrink-0">
          <div className="flex items-center w-10">
            {/* This triggers your MobileSidebar drawer */}
            <MobileSidebar />
          </div>

          <div className="flex items-center justify-center gap-2 flex-1">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight uppercase text-xs">StudentAI</span>
          </div>

          {/* Spacer to keep the logo perfectly centered */}
          <div className="w-10" /> 
        </header>

        {/* 4. Page Content Container */}
        {/* 'overflow-y-auto' ensures only this area scrolls, keeping sidebar/header fixed */}
        <div 
          id="dashboard-scroll-container" 
          className="flex-1 overflow-y-auto scroll-smooth relative"
        >
          <div className="max-w-7xl mx-auto w-full min-h-full p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}