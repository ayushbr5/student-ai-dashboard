"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar automatically when a link is clicked
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    // FIXED: Added w-10 here to match the spacer in layout.tsx for perfect centering
    <div className="md:hidden w-10"> 
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors flex items-center justify-center"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar Drawer */}
          <div className="relative w-[280px] bg-white h-full shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
             <div className="absolute right-4 top-5 z-[110]">
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="p-2 bg-slate-50 text-slate-400 rounded-full hover:text-slate-600 transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             {/* Use the standard Sidebar component */}
             <div className="flex-1 overflow-y-auto">
                <Sidebar />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}