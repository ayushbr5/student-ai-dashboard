"use client";

import { useCompletion } from '@ai-sdk/react'; //
import { X, Wand2, Sparkles, Loader2, Bot, AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  systemPrompt: string;
}

export default function AIToolModal({ isOpen, onClose, toolName, systemPrompt }: Props) {
  // Logic matches your provided Storyteller code
  const { 
    completion, 
    complete, 
    isLoading, 
    error, 
    input, 
    handleInputChange 
  } = useCompletion({
    api: '/api/chat', // Pointing to your chat route but using completion logic
    streamProtocol: 'text', // Matches toTextStreamResponse or result.text
    body: {
      systemRole: systemPrompt // Pass the tool's specialized instruction
    },
    onError: (err) => {
      console.error(`${toolName} Error:`, err);
    }
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic for the generated completion text
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [completion]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[40px] w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{toolName}</h2>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">AI Power Tool</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={28} />
          </button>
        </div>

        {/* Display Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
          {!completion && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Bot size={48} className="mb-4" />
              <p className="italic">Paste your text below to use the {toolName}!</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex gap-2 items-center border border-red-100">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">Something went wrong. Please try again.</span>
            </div>
          )}

          {completion && (
            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <h3 className="font-bold text-blue-600 mb-3 uppercase text-xs tracking-widest flex items-center gap-2">
                <Sparkles size={14} /> AI Result
              </h3>
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {completion}
              </p>
            </div>
          )}
          
          {isLoading && (
            <div className="flex items-center gap-3 text-blue-600 font-bold text-xs animate-pulse p-4 bg-blue-50 rounded-2xl w-fit">
              <Loader2 className="animate-spin" size={16} /> {toolName.toUpperCase()} IS WORKING...
            </div>
          )}
        </div>

        {/* Input & Action - Matches your Storyteller logic */}
        <div className="p-8 border-t bg-slate-50/50 space-y-4">
          <textarea
            className="w-full p-5 rounded-[24px] border-2 border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all text-slate-800 bg-white min-h-[120px] resize-none"
            placeholder={`Enter details for the ${toolName}...`}
            value={input}
            onChange={handleInputChange}
          />
          <button 
            onClick={() => complete(input)} //
            disabled={!input || isLoading}
            className="w-full p-5 bg-blue-600 text-white rounded-[24px] font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            {isLoading ? "Processing..." : `Run ${toolName}`}
          </button>
        </div>
      </div>
    </div>
  );
}