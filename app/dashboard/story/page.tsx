"use client";

import { useCompletion } from '@ai-sdk/react';
import { Sparkles, Wand2, Loader2, AlertCircle } from 'lucide-react';

export default function StorytellerPage() {
  // Use built-in input and handleInputChange for better reliability
  const { 
    completion, 
    complete, 
    isLoading, 
    error, 
    input, 
    handleInputChange 
  } = useCompletion({
    api: '/api/story',
    streamProtocol: 'text', // Explicitly match toTextStreamResponse
    body: {
        interests: ["Space", "Robots"] 
    },
    onError: (err) => {
      console.error("AI Stream Error:", err);
    }
  });

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="text-blue-600" /> AI Math Storyteller
      </h1>
      
      <textarea
        className="w-full p-4 rounded-xl border mb-4 h-32 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
        placeholder="Paste your boring math problem here..."
        // Use hook-managed state
        value={input} 
        onChange={handleInputChange}
      />

      <button
        // Calling complete() without arguments uses the current 'input' state
        onClick={() => complete(input)} 
        disabled={isLoading || !input}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
      >
        {isLoading ? (
          <><Loader2 className="animate-spin" /> Working Magic...</>
        ) : (
          <><Wand2 size={20} /> Turn into Story</>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex gap-2 items-center">
          <AlertCircle size={18} />
          <span>Error: {error.message}</span>
        </div>
      )}

      {completion && (
        <div className="mt-8 p-6 bg-white rounded-2xl border border-blue-100 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <h2 className="font-bold text-blue-600 mb-2 uppercase text-xs tracking-widest">Your Adventure</h2>
          <p className="text-slate-800 leading-relaxed italic whitespace-pre-wrap">
            {completion}
          </p>
        </div>
      )}
    </div>
  );
}