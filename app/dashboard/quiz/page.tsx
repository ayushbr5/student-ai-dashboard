"use client";

import { useState } from 'react';
import { 
  Brain, Trophy, Sparkles, Play, 
  Wand2, Target, Flame, Zap, 
  ChevronRight, ArrowRight
} from 'lucide-react';
import QuizModal from '@/components/QuizModal';

export default function QuizPage() {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [topic, setTopic] = useState("");

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. PREMIUM HERO SECTION */}
      <header className="relative overflow-hidden bg-slate-900 rounded-[40px] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[100px] -mr-40 -mt-40 rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-widest uppercase mb-4">
              <Zap size={14} className="fill-emerald-400" /> AI Knowledge Engine
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Master any <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Subject Instantly.</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center min-w-[120px]">
              <Trophy className="text-yellow-400 mx-auto mb-2" size={24} />
              <p className="text-2xl font-black">1,250</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase">Total XP</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center min-w-[120px]">
              <Flame className="text-orange-500 mx-auto mb-2" size={24} />
              <p className="text-2xl font-black">5 Days</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase">Streak</p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. AI CUSTOM QUIZ GENERATOR */}
      <section className="relative">
        <div className="bg-white rounded-[42px] border border-slate-200 shadow-2xl p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-[100px] -mr-20 -mt-20 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Wand2 className="text-emerald-500" /> Generate Custom Quiz
            </h2>
            <p className="text-slate-500 font-medium mb-8">What do you want to be tested on today? Describe a topic, upload a note, or paste a syllabus.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="e.g. Molecular Biology basics or Ancient Rome's fall..."
                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all font-medium text-slate-700"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button 
                onClick={() => setActiveQuiz('custom')}
                disabled={!topic}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                Generate <Sparkles size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENT / PRESET CHALLENGES */}
      <section>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
          <div className="w-8 h-[2px] bg-emerald-600" /> Mastery Challenges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preset Challenge 1 */}
          <div className="group relative bg-white p-8 rounded-[42px] border border-slate-200 hover:border-emerald-500 transition-all duration-500 hover:shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Target size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Algebra Speed-Run</h4>
                <p className="text-slate-500 text-sm font-medium">15 Questions • 10 Mins • Hard</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveQuiz('preset-1')}
              className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-colors shadow-lg"
            >
              <Play size={20} fill="currentColor" className="ml-1" />
            </button>
          </div>

          {/* Preset Challenge 2 */}
          <div className="group relative bg-white p-8 rounded-[42px] border border-slate-200 hover:border-blue-500 transition-all duration-500 hover:shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Brain size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">General Logic</h4>
                <p className="text-slate-500 text-sm font-medium">10 Questions • No Timer • Easy</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveQuiz('preset-2')}
              className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Play size={20} fill="currentColor" className="ml-1" />
            </button>
          </div>
        </div>
      </section>

      <QuizModal 
        isOpen={!!activeQuiz} 
        onClose={() => setActiveQuiz(null)} 
      />
    </div>
  );
}