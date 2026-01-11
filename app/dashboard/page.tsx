"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, MessageSquare, StickyNote, 
  ArrowRight, Trophy, Star, Clock, 
  ChevronRight, Sparkles, BrainCircuit, Activity,
  Wrench // Added for the AI Tools icon
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    notesCount: 0,
    masteredCount: 0,
    lastMastered: null as string | null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [notesRes, masteryRes] = await Promise.all([
          fetch('/api/notes'),
          fetch('/api/mastery/all')
        ]);
        
        const notesData = await notesRes.json();
        const masteryData = await masteryRes.json();

        setStats({
          notesCount: notesData.length || 0,
          masteredCount: masteryData.length || 0,
          lastMastered: masteryData[0]?.question || "Start studying to save facts!"
        });
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* 1. WELCOME HERO SECTION */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-[80px]" />
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={14} /> Academic Sync Active
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
            Ready to <br /><span className="text-blue-500">Study?</span>
          </h1>
          <p className="text-slate-400 max-w-lg font-medium leading-relaxed">
            You've successfully saved <span className="text-white font-bold">{stats.masteredCount} facts</span> to your permanent knowledge collection.
          </p>
          
          {/* UPDATED: Buttons row with AI Tools */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/dashboard/story" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg">
              <MessageSquare size={16} /> AI Chat Assistant
            </Link>
            <Link href="/dashboard/tools" className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/40 text-blue-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all backdrop-blur-md border border-blue-500/30">
              <Wrench size={16} /> AI Tools
            </Link>
            <Link href="/dashboard/recall" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all backdrop-blur-md border border-white/10">
              <Zap size={16} /> Create Flashcards
            </Link>
          </div>
        </div>
      </div>

      {/* 2. CORE FEATURE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Assistant Hub Card */}
        <Link href="/dashboard/story" className="group bg-white p-6 rounded-[32px] border border-slate-200 hover:border-violet-400 hover:shadow-xl transition-all relative">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-600 group-hover:text-white transition-all">
            <BrainCircuit size={24} />
          </div>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-2">AI Assistant</h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">Chat with your tutor or turn math into stories.</p>
          <div className="flex items-center text-[10px] font-black text-violet-600 uppercase tracking-widest">
            Chat Now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Study Sync Card (Formerly Neural Lab) */}
        <Link href="/dashboard/recall" className="group bg-white p-6 rounded-[32px] border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Zap size={24} />
          </div>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-2">Study Sync</h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">Turn your latest notes into flashcards instantly.</p>
          <div className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest">
            Make Cards <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Notes Card */}
        <Link href="/dashboard/notes" className="group bg-white p-6 rounded-[32px] border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <StickyNote size={24} />
          </div>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-2">My Notes</h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">You have {stats.notesCount} saved notes to learn from.</p>
          <div className="flex items-center text-[10px] font-black text-amber-600 uppercase tracking-widest">
            Open Notebook <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* My Knowledge Card (Formerly Mastery Bank) */}
        <Link href="/dashboard/recall/bank" className="group bg-white p-6 rounded-[32px] border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <Trophy size={24} />
          </div>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-2">My Knowledge</h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">Browse through your {stats.masteredCount} saved facts.</p>
          <div className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            View My Facts <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* 3. PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity size={18} /></div>
              <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-widest">Recent Progress</h3>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Star size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Latest Fact Saved</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[200px] md:max-w-md">
                    {stats.lastMastered}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[40px] p-8 text-white flex flex-col justify-between shadow-xl">
          <div>
            <Sparkles size={32} className="mb-6 text-indigo-200" />
            <h4 className="text-xl font-black uppercase tracking-tight mb-4">Study Tip</h4>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium">
              Regularly sync your notes to keep your flashcards up to date with what you're learning.
            </p>
          </div>
          <Link href="/dashboard/recall" className="mt-8 flex items-center justify-center py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}