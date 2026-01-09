"use client";

import { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function QuizModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  if (!isOpen) return null;

  const demoQuestion = {
    text: "A rectangular plot's length is 2 meters more than twice its breadth. If the perimeter is 154m, what is the length?",
    options: ["25m", "50m", "52m", "75m"],
    correct: 2
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] p-8 max-w-xl w-full shadow-2xl overflow-hidden relative">
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Question 1 of 10</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
          {demoQuestion.text}
        </h2>

        <div className="space-y-3 mb-8">
          {demoQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex justify-between items-center ${
                selectedAnswer === index 
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' 
                : 'border-slate-100 hover:border-slate-200 text-slate-600'
              }`}
            >
              {option}
              {selectedAnswer === index && <CheckCircle2 size={20} />}
            </button>
          ))}
        </div>

        <button 
          disabled={selectedAnswer === null}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-blue-100"
        >
          Next Question <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}