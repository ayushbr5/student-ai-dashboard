"use client";

import { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  RefreshCcw,
  Sparkles,
  Trophy,
  History,
  Library,
  Lightbulb,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import FlashcardModal from '@/components/FlashcardModal';

interface MasteredCard {
  id: string;
  question: string;
  subject: string;
}

export default function StudySyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeDeck, setActiveDeck] = useState<string | null>(null);
  const [syncedCards, setSyncedCards] = useState<{q: string, a: string}[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [masteryStats, setMasteryStats] = useState<{total: number, recent: MasteredCard[]}>({
    total: 0,
    recent: []
  });

  // Fetch real-time mastery data from the My Knowledge bank
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/mastery/all');
        if (res.ok) {
          const data = await res.json();
          setMasteryStats({
            total: data.length,
            recent: data.slice(0, 4)
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, [activeDeck]); 

  const handleSync = async () => {
    setIsSyncing(true);
    setShowWarning(false);

    try {
      // 1. Check if user has notes before generating cards
      const notesRes = await fetch('/api/notes');
      const notesData = await notesRes.json();

      if (!notesData || notesData.length === 0) {
        setShowWarning(true);
        setIsSyncing(false);
        return; 
      }

      // 2. Proceed with AI Sync if notes exist
      const res = await fetch('/api/sync-recall', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSyncedCards(data);
        setActiveDeck("New Study Session");
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* 1. HIGH-ATTENTION AI SYNC HERO */}
      <div className="relative group overflow-hidden bg-indigo-600 rounded-[32px] p-1 shadow-2xl shadow-indigo-200">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 group-hover:animate-gradient-x transition-all" />
        
        <div className="relative bg-slate-900 rounded-[28px] p-8 md:p-12 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <Sparkles size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
              Ready to <span className="text-indigo-400 italic">Level Up?</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl">
              Our AI analyzes your recent notes to generate 5 custom flashcards for a quick study session.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="group relative flex items-center gap-4 px-10 py-5 bg-indigo-600 hover:bg-white text-white hover:text-indigo-600 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/40 active:scale-95 disabled:opacity-50"
            >
              <RefreshCcw size={24} className={isSyncing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"} />
              <span className="font-black text-sm uppercase tracking-[0.2em]">
                {isSyncing ? "Checking Notes..." : "Start Study Sync"}
              </span>
            </button>

            {/* ERROR POPUP WITH LINK TO NOTES */}
            {showWarning && (
              <div className="flex flex-col items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">
                    No notes found!
                  </span>
                </div>
                <Link 
                  href="/dashboard/notes" 
                  className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-white underline underline-offset-4 uppercase tracking-wider transition-colors"
                >
                  Go to Notebook to add some <ChevronRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. STATS & QUICK NAV */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-[24px] shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{masteryStats.total}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facts Saved</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-[24px] shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Lightbulb size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{Math.floor(masteryStats.total / 5)}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Study Streaks</p>
          </div>
        </div>

        <Link href="/dashboard/recall/bank" className="group bg-indigo-600 p-6 rounded-[24px] shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
              <Library size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest">My Knowledge</p>
          </div>
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

      {/* 3. RECENT ACTIVITY FEED */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <History size={18} className="text-slate-400" />
            <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-widest">Recently Saved Facts</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {masteryStats.recent.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-400 text-xs italic font-medium">
              Start a Study Sync to see your recently saved facts here.
            </div>
          ) : (
            masteryStats.recent.map((card) => (
              <div key={card.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{card.question}</p>
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">{card.subject}</p>
                </div>
                <Zap size={14} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
              </div>
            ))
          )}
        </div>
      </div>

      <FlashcardModal 
        isOpen={!!activeDeck} 
        onClose={() => { setActiveDeck(null); setSyncedCards([]); }} 
        deckTitle={activeDeck || ""} 
        cards={syncedCards} 
      />
    </div>
  );
}