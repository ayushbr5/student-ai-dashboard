"use client";

import { useState, useEffect } from 'react';
import { X, ChevronRight, Sparkles, HelpCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface Flashcard {
  q: string;
  a: string;
}

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckTitle: string;
  cards: Flashcard[];
}

export default function FlashcardModal({ isOpen, onClose, deckTitle, cards = [] }: FlashcardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(0);
      setIsFlipped(false);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasCards = cards && cards.length > 0;
  const progressPercentage = hasCards ? ((currentIdx + 1) / cards.length) * 100 : 0;

  // The Mastered Save Logic
  const handleMarkAsMastered = async () => {
    if (isSaving || saveSuccess) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/mastery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: cards[currentIdx].q,
          a: cards[currentIdx].a,
          subject: deckTitle
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        // Reset checkmark after 2 seconds
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Mastery save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-in zoom-in duration-300">
        
        {/* Compact Header & Progress */}
        <div className="mb-4 px-2 space-y-3">
          <div className="flex justify-between items-center text-white">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Reviewing</p>
              <h2 className="text-base font-bold">{deckTitle}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
              <X size={18} />
            </button>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* 3D Card Container */}
        <div className="relative h-72 w-full [perspective:1000px]">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          >
            {/* FRONT Face */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-2xl border border-slate-100">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl mb-4">
                <HelpCircle size={24} />
              </div>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                {cards[currentIdx]?.q}
              </p>
              <p className="mt-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">Click to flip</p>
            </div>

            {/* BACK Face */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-indigo-600 rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-2xl text-white">
              <div className="p-2.5 bg-white/20 rounded-xl mb-4">
                <Sparkles size={24} />
              </div>
              <p className="text-base font-medium leading-relaxed italic mb-6 px-2">
                {cards[currentIdx]?.a}
              </p>
              
              {/* THE MASTERY BUTTON */}
              <button 
                onClick={(e) => { e.stopPropagation(); handleMarkAsMastered(); }}
                disabled={isSaving || saveSuccess}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg ${
                  saveSuccess 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-indigo-600 hover:bg-indigo-50 active:scale-95'
                }`}
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : saveSuccess ? <CheckCircle2 size={14} /> : null}
                {saveSuccess ? "Saved to My Knowledge" : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="mt-6 flex items-center justify-between px-2">
          <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">
            Card {currentIdx + 1} of {cards.length}
          </span>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (currentIdx < cards.length - 1) {
                setCurrentIdx(prev => prev + 1);
                setIsFlipped(false);
                setSaveSuccess(false);
              } else {
                onClose();
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl text-slate-900 font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
          >
            {currentIdx < cards.length - 1 ? 'Next' : 'Finish'} <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}