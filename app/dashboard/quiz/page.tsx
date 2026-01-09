"use client";

import { useState } from 'react';
import { Brain, Trophy, Timer, Star, Play } from 'lucide-react';
import QuizModal from '@/components/QuizModal';

const categories = [
  {
    id: 'geometry-1',
    title: 'Geometry Basics',
    questions: 10,
    difficulty: 'Beginner',
    icon: Brain,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 'algebra-1',
    title: 'Algebra Speed-Run',
    questions: 15,
    difficulty: 'Intermediate',
    icon: Timer,
    color: 'text-purple-600 bg-purple-100'
  }
];

export default function QuizPage() {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brain Gym</h1>
          <p className="text-slate-500 mt-2">Test your knowledge and earn XP!</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-white p-3 rounded-2xl border flex items-center gap-3">
            <Trophy className="text-yellow-500" size={20} />
            <span className="font-bold text-slate-700">1,250 XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${cat.color}`}>
                <cat.icon size={28} />
              </div>
              <div className="flex gap-1 text-yellow-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">{cat.title}</h3>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1"><Brain size={14} /> {cat.questions} Questions</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold">{cat.difficulty}</span>
            </div>

            <button 
              onClick={() => setActiveQuiz(cat.id)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors"
            >
              <Play size={18} fill="currentColor" /> Start Quiz
            </button>
          </div>
        ))}
      </div>

      <QuizModal 
        isOpen={!!activeQuiz} 
        onClose={() => setActiveQuiz(null)} 
      />
    </div>
  );
}