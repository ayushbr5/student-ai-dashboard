"use client";

import { useState, useEffect } from 'react';
import { 
  Search, Trash2, BookOpen, 
  ArrowLeft, Brain, Filter, 
  ChevronRight, Loader2 
} from 'lucide-react';
import Link from 'next/link';

interface SavedFact {
  id: string;
  question: string;
  answer: string;
  subject: string;
  createdAt: string;
}

export default function MyKnowledgePage() {
  const [cards, setCards] = useState<SavedFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch all permanent facts from the database
  useEffect(() => {
    const fetchKnowledgeBank = async () => {
      try {
        const res = await fetch('/api/mastery/all'); 
        if (res.ok) {
          const data = await res.json();
          setCards(data);
        }
      } catch (err) {
        console.error("Failed to load knowledge bank", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKnowledgeBank();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this fact from your saved collection?")) return;
    try {
      const res = await fetch(`/api/mastery?id=${id}`, { method: 'DELETE' });
      if (res.ok) setCards(cards.filter(c => c.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredCards = cards.filter(c => 
    c.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Your Knowledge...</p>
    </div>
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER & NAVIGATION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/recall" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:gap-3 transition-all mb-2">
            <ArrowLeft size={14} /> Back to Study Sync
          </Link>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <BookOpen className="text-indigo-600" /> My Knowledge
          </h1>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text"
            placeholder="SEARCH SAVED FACTS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      {/* FACTS GRID */}
      {filteredCards.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-20 text-center">
          <Brain size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No saved facts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => (
            <div key={card.id} className="group bg-white border border-slate-200 p-6 rounded-[24px] hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(card.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-md">
                  {card.subject}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight mb-2">Q: {card.question}</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-3">
                    A: {card.answer}
                  </p>
                </div>
                <div className="pt-2 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                   <span>Added {new Date(card.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}