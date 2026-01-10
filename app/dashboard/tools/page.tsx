"use client";

import { useState, useEffect, useRef } from 'react';
import { useCompletion } from '@ai-sdk/react';
import { 
  Sparkles, Brain, Globe, PencilLine, HelpCircle, 
  FileSearch, Code, BookText, UserCircle, ChevronRight, 
  Lightbulb, ArrowLeft, Wand2, Loader2, Bot, AlertCircle,
  Trash2, Save, Check
} from 'lucide-react';

const tools = [
  { id: 'eli5', name: 'Concept Simplifier', description: 'Breaks down complex topics into simple analogies.', icon: Lightbulb, color: 'bg-blue-100 text-blue-600', systemPrompt: "You are the 'Explain Like I'm 5' bot. Use simple analogies and zero jargon." },
  { id: 'socratic', name: 'Socratic Hint Bot', description: 'Get helpful hints without giving away the answer.', icon: HelpCircle, color: 'bg-purple-100 text-purple-600', systemPrompt: "You are a Socratic tutor. Never give the answer directly. Ask leading questions." },
  { id: 'real-world', name: 'Real-World Math', description: 'Discover how formulas are used in cool careers.', icon: Globe, color: 'bg-orange-100 text-orange-600', systemPrompt: "Explain the real-world application of any math topic." },
  { id: 'problem-decoder', name: 'Problem Decoder', description: 'Breaks problems into bite-sized levels.', icon: Brain, color: 'bg-green-100 text-green-600', systemPrompt: "Break math problems into Level 1, 2, and 3 steps." },
  { id: 'study-buddy', name: 'AI Study Buddy', description: 'Generate practice quizzes from your topics.', icon: Sparkles, color: 'bg-pink-100 text-pink-600', systemPrompt: "Generate 5 multiple-choice questions based on the topic." },
  { id: 'polisher', name: 'Grammar Polisher', description: 'Make your essays and reports sound professional.', icon: PencilLine, color: 'bg-indigo-100 text-indigo-600', systemPrompt: "Review text for grammar and tone." },
  { id: 'summarizer', name: 'Note Summarizer', description: 'Turns long text into 5 key bullet points.', icon: FileSearch, color: 'bg-yellow-100 text-yellow-600', systemPrompt: "Extract the 5 most important points." },
  { id: 'code-explainer', name: 'Code Explainer', description: 'Understand what every line of code does.', icon: Code, color: 'bg-slate-800 text-slate-100', systemPrompt: "Explain code snippets line-by-line." },
  { id: 'vocab-story', name: 'Vocab Storyteller', description: 'Learn new words through funny short stories.', icon: BookText, color: 'bg-red-100 text-red-600', systemPrompt: "Write a 2-minute funny story using vocab words." },
  { id: 'historical-chat', name: 'Historical Figure', description: 'Interview famous scientists and mathematicians.', icon: UserCircle, color: 'bg-emerald-100 text-emerald-600', systemPrompt: "Adopt the persona of a famous scientist." },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<typeof tools[0] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { completion, complete, isLoading, error, input, handleInputChange, setCompletion, setInput } = useCompletion({
    api: '/api/chat',
    streamProtocol: 'text',
    body: { systemRole: activeTool?.systemPrompt },
    id: activeTool?.id
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const tool = tools.find(t => t.id === hash);
      setActiveTool(tool || null);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const selectTool = (tool: typeof tools[0]) => {
    window.location.hash = tool.id;
    setActiveTool(tool);
  };

  const handleBack = () => {
    window.location.hash = '';
    setActiveTool(null);
    handleClear();
  };

  const handleClear = () => {
    setInput("");
    setCompletion("");
    setIsSaved(false);
  };

  const saveToDB = async () => {
    if (!completion || !input) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/save-tool', {
        method: 'POST',
        body: JSON.stringify({
          toolName: activeTool?.name,
          toolId: activeTool?.id,
          input,
          output: completion
        })
      });
      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (activeTool) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-left-4 duration-300">
        <div className="flex flex-row justify-between items-center mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Back to Tools</span>
            <span className="sm:hidden">Back</span>
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-all font-bold text-sm">
            <Trash2 size={16} /> <span className="hidden sm:inline">Clear Chat</span><span className="sm:hidden">Clear</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${activeTool.color}`}>
            <activeTool.icon size={24} className="sm:w-[28px] sm:h-[28px]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{activeTool.name}</h1>
            <p className="text-slate-500 text-xs sm:text-sm line-clamp-1">{activeTool.description}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-[24px] border border-slate-200 shadow-sm relative">
            <textarea
              ref={textareaRef}
              rows={1}
              className="w-full p-2 bg-transparent outline-none text-slate-800 text-sm sm:text-base resize-none overflow-hidden min-h-[44px]"
              placeholder={`Type or paste here...`}
              value={input}
              onChange={handleInputChange}
            />
            <button
              onClick={() => complete(input)}
              disabled={isLoading || !input}
              className="w-full mt-4 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
              {isLoading ? "Thinking..." : `Run ${activeTool.name}`}
            </button>
          </div>

          {completion && (
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-[24px] animate-in zoom-in-95 duration-500 relative">
              <button 
                onClick={saveToDB}
                disabled={isSaving}
                className={`absolute right-4 top-4 sm:right-6 sm:top-6 p-2 sm:p-3 rounded-xl transition-all flex items-center gap-2 text-[10px] sm:text-xs font-bold shadow-sm ${
                  isSaved ? 'bg-green-500 text-white' : 'bg-white text-slate-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : isSaved ? <Check size={14} /> : <Save size={14} />}
                <span className="hidden xs:inline">{isSaved ? 'Saved!' : 'Save Result'}</span>
              </button>
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase text-[10px] tracking-widest mb-4">
                <Sparkles size={14} /> Result
              </div>
              <p className="text-slate-800 leading-relaxed text-sm whitespace-pre-wrap pr-0 sm:pr-10">{completion}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">AI <span className="text-blue-600">TOOLS</span></h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-lg font-medium">Specialized assistants for your learning adventure.</p>
      </div>

      {/* FIXED GRID: max 3 per row on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div 
            key={tool.id} 
            onClick={() => selectTool(tool)} 
            className="group p-6 bg-white border border-slate-200 rounded-[32px] hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[200px] md:min-h-[220px]"
          >
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${tool.color}`}>
                <tool.icon size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-tight mb-2">{tool.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-medium">{tool.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] font-black text-blue-600 uppercase tracking-widest">
              <span>Open Tool</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
            {/* Background Icon Decoration */}
            <div className={`absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${tool.color}`}>
               <tool.icon size={120} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}