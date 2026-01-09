"use client";

import { useState, useEffect, useRef } from 'react';
import { useCompletion } from '@ai-sdk/react';
import { 
  Sparkles, Brain, Globe, PencilLine, HelpCircle, 
  FileSearch, Code, BookText, UserCircle, ChevronRight, 
  Lightbulb, ArrowLeft, Wand2, Loader2, Bot, AlertCircle 
} from 'lucide-react';

const tools = [
  {
    id: 'eli5',
    name: 'Concept Simplifier',
    description: 'Breaks down complex topics into simple analogies.',
    icon: Lightbulb,
    color: 'bg-blue-100 text-blue-600',
    systemPrompt: "You are the 'Explain Like I'm 5' bot. Use simple analogies and zero jargon to explain complex topics."
  },
  {
    id: 'socratic',
    name: 'Socratic Hint Bot',
    description: 'Get helpful hints without giving away the answer.',
    icon: HelpCircle,
    color: 'bg-purple-100 text-purple-600',
    systemPrompt: "You are a Socratic tutor. Never give the answer directly. Ask leading questions to help the student find it."
  },
  {
    id: 'real-world',
    name: 'Real-World Math',
    description: 'Discover how formulas are used in cool careers.',
    icon: Globe,
    color: 'bg-orange-100 text-orange-600',
    systemPrompt: "Explain the real-world application of any math topic. Mention 3 specific jobs that use it."
  },
  {
    id: 'problem-decoder',
    name: 'Problem Decoder',
    description: 'Breaks problems into bite-sized levels.',
    icon: Brain,
    color: 'bg-green-100 text-green-600',
    systemPrompt: "Break math problems into Level 1, 2, and 3 steps. Ask the student if they understand each step."
  },
  {
    id: 'study-buddy',
    name: 'AI Study Buddy',
    description: 'Generate practice quizzes from your topics.',
    icon: Sparkles,
    color: 'bg-pink-100 text-pink-600',
    systemPrompt: "Generate 5 multiple-choice questions based on the topic provided. Explain the logic for wrong answers."
  },
  {
    id: 'polisher',
    name: 'Grammar Polisher',
    description: 'Make your essays and reports sound professional.',
    icon: PencilLine,
    color: 'bg-indigo-100 text-indigo-600',
    systemPrompt: "Review text for grammar and tone. Suggest ways to make it sound more academic or persuasive."
  },
  {
    id: 'summarizer',
    name: 'Note Summarizer',
    description: 'Turns long text into 5 key bullet points.',
    icon: FileSearch,
    color: 'bg-yellow-100 text-yellow-600',
    systemPrompt: "Extract the 5 most important points and key vocabulary from any text provided."
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer',
    description: 'Understand what every line of code does.',
    icon: Code,
    color: 'bg-slate-800 text-slate-100',
    systemPrompt: "Explain code snippets line-by-line for a student learning computer science."
  },
  {
    id: 'vocab-story',
    name: 'Vocab Storyteller',
    description: 'Learn new words through funny short stories.',
    icon: BookText,
    color: 'bg-red-100 text-red-600',
    systemPrompt: "Write a 2-minute funny story using the list of vocabulary words provided by the student."
  },
  {
    id: 'historical-chat',
    name: 'Historical Figure',
    description: 'Interview famous scientists and mathematicians.',
    icon: UserCircle,
    color: 'bg-emerald-100 text-emerald-600',
    systemPrompt: "Adopt the persona of a famous scientist or mathematician. Answer questions as if you were them."
  },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<typeof tools[0] | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { 
    completion, 
    complete, 
    isLoading, 
    error, 
    input, 
    handleInputChange, 
    setCompletion,
    setInput
  } = useCompletion({
    api: '/api/chat',
    streamProtocol: 'text',
    body: {
      systemRole: activeTool?.systemPrompt 
    },
    id: activeTool?.id
  });

  // --- FIX 1: URL PERSISTENCE ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const tool = tools.find(t => t.id === hash);
      if (tool) setActiveTool(tool);
      else setActiveTool(null);
    };

    handleHashChange(); // Run on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectTool = (tool: typeof tools[0]) => {
    window.location.hash = tool.id;
    setActiveTool(tool);
  };

  const handleBack = () => {
    window.location.hash = '';
    setActiveTool(null);
    setCompletion("");
    setInput("");
  };

  // --- FIX 2: AUTO-EXPANDING TEXTAREA ---
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // 1. TOOL WORKSPACE VIEW
  if (activeTool) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-left-4 duration-300">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-all font-bold group text-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Tools
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${activeTool.color}`}>
            <activeTool.icon size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{activeTool.name}</h1>
            <p className="text-slate-500 text-sm">{activeTool.description}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <textarea
              ref={textareaRef}
              rows={1}
              className="w-full p-2 bg-transparent outline-none text-slate-800 text-base resize-none overflow-hidden transition-all duration-100 min-h-[44px]"
              placeholder={`Paste or type here...`}
              value={input}
              onChange={handleInputChange}
            />
            <button
              onClick={() => complete(input)}
              disabled={isLoading || !input}
              className="w-full mt-4 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
              {isLoading ? "Thinking..." : `Run ${activeTool.name}`}
            </button>
          </div>

          {completion && (
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-[24px] animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase text-[10px] tracking-widest mb-4">
                <Sparkles size={14} /> Result
              </div>
              <p className="text-slate-800 leading-relaxed text-sm whitespace-pre-wrap">
                {completion}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. MAIN GRID MENU
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
          AI <span className="text-blue-600">TOOLS</span>
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Specialized assistants for your learning adventure.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => selectTool(tool)}
            className="group p-5 bg-white border border-slate-200 rounded-[24px] hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-[180px]"
          >
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${tool.color}`}>
                <tool.icon size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-800 leading-tight mb-1">{tool.name}</h3>
              <p className="text-slate-400 text-xs leading-snug line-clamp-2 font-medium">
                {tool.description}
              </p>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-[10px] font-black text-blue-600 uppercase tracking-wider">
              <span>Open Tool</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${tool.color}`}>
               <tool.icon size={80} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}