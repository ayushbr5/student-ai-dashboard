'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompletion } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, Wand2, Loader2, AlertCircle, MessageSquare, 
  BookOpen, Mic, Send, Bot, Volume2, StopCircle, Paperclip, X 
} from 'lucide-react';

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'storyteller' ? 'storyteller' : 'chat';
  const [activeTab, setActiveTab] = useState<'storyteller' | 'chat'>(initialTab);
  const [systemRole, setSystemRole] = useState("You are a helpful AI academic assistant.");

  // Storyteller Hook
  const {
    completion,
    complete,
    isLoading: isStoryLoading,
    error: storyError,
    input: storyInput,
    handleInputChange: handleStoryInputChange
  } = useCompletion({
    api: '/api/story',
    streamProtocol: 'text',
    body: { interests: ["Space", "Robots"] },
    onError: (err) => console.error("Story Stream Error:", err)
  });

  // General Chat State
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Hello! I am your **EduFlux AI** study companion. I can help you with homework, explain complex topics, or just chat. How can I help you today?'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<Error | null>(null);
  const [localInput, setLocalInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // STT Logic
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        setLocalInput(event.results[0][0].transcript);
      };
      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  // TTS Logic
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAttachedFile(e.target.files[0]);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSend = async (e?: React.FormEvent, manualPrompt?: string) => {
    e?.preventDefault();
    const prompt = manualPrompt || localInput;
    if (!prompt.trim() || isLoading) return;

    const userMsg = {
      id: generateId(),
      role: 'user',
      content: attachedFile ? `[Attached: ${attachedFile.name}] ${prompt}` : prompt
    };

    setMessages(prev => [...prev, userMsg]);
    setLocalInput('');
    
    let fileData = null;
    if (attachedFile) {
      const base64 = await convertToBase64(attachedFile);
      fileData = { name: attachedFile.name, type: attachedFile.type, data: base64 };
    }
    setAttachedFile(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], systemRole, fileData }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiMsgId = generateId();
      let aiContent = "";

      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        aiContent += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, content: aiContent } : msg
        ));
      }
    } catch (err: any) {
      setChatError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
            <div className="p-3 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <Bot className="w-8 h-8 text-white" />
            </div>
            Assistant Hub
          </h1>
          <p className="text-slate-500 mt-2 font-medium ml-1">Your personal AI powerhouse</p>
        </motion.div>

        {/* Tab Switcher - Styled for EduFlux */}
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('storyteller')} 
            className={`relative px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'storyteller' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {activeTab === 'storyteller' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-violet-600 rounded-xl shadow-lg shadow-violet-200" />}
            <span className="relative z-10 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Storyteller</span>
          </button>
          <button 
            onClick={() => setActiveTab('chat')} 
            className={`relative px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {activeTab === 'chat' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200" />}
            <span className="relative z-10 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> General Chat</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'storyteller' ? (
          <motion.div key="story" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="grid md:grid-cols-2 gap-8 h-full">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col">
              <h2 className="font-black text-xl mb-6 flex items-center gap-3 text-slate-800 tracking-tight">
                <Sparkles className="text-violet-600 w-6 h-6" /> Transform Math
              </h2>
              <textarea 
                className="w-full p-6 rounded-2xl border-none mb-6 h-64 outline-none bg-slate-50 text-slate-700 font-medium placeholder:text-slate-300 resize-none focus:ring-2 focus:ring-violet-200 transition-all" 
                value={storyInput} 
                onChange={handleStoryInputChange} 
                placeholder="Paste a boring math problem here and watch the magic happen..." 
              />
              <button 
                onClick={() => complete(storyInput)} 
                disabled={isStoryLoading || !storyInput} 
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-violet-200 disabled:opacity-50"
              >
                {isStoryLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />} Cast Story Spell
              </button>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-inner h-full min-h-[500px] overflow-y-auto">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                 <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">The Narrative</span>
              </div>
              {completion ? (
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-lg">{completion}</p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                  <Wand2 className="w-12 h-12 opacity-20" />
                  <p className="font-bold text-sm tracking-widest uppercase">Awaiting your magic...</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="chat" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 30 }} 
            className="h-[750px] flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            {/* Redesigned Chat Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Bot size={22} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm tracking-tight">EduFlux Tutor</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Powered by AI</span>
                  </div>
                </div>
              </div>
              <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button onClick={() => setSystemRole("Strict Tutor")} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${systemRole.includes("Strict") ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Tutor</button>
                <button onClick={() => setSystemRole("Casual Buddy")} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${systemRole.includes("Casual") ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Buddy</button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
              {messages.map((m) => (
                <motion.div 
                  key={m.id} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-violet-600 border border-slate-100'}`}>
                    {m.role === 'user' ? <span className="text-[10px] font-black">YOU</span> : <Bot size={20} />}
                  </div>
                  <div className={`flex flex-col gap-2 max-w-[75%] ${m.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none font-medium' 
                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none font-medium prose prose-slate max-w-none'
                    }`}>
                      <ReactMarkdown 
                        components={{
                          strong: ({node, ...props}) => <span className="font-black text-indigo-900" {...props} />,
                          p: ({node, ...props}) => <p className="mb-0" {...props} />
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                    {m.role === 'assistant' && (
                      <button 
                        onClick={() => isSpeaking ? stopSpeaking() : speak(m.content)} 
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors p-1"
                      >
                        {isSpeaking ? <StopCircle size={14}/> : <Volume2 size={14}/>} {isSpeaking ? 'Stop' : 'Listen'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Redesigned Chat Input */}
            <div className="p-6 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="flex gap-3 items-center bg-slate-50 p-2 rounded-[2rem] border border-slate-200 focus-within:border-indigo-300 focus-within:bg-white transition-all">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="p-3.5 bg-white text-slate-400 hover:text-indigo-600 rounded-full shadow-sm transition-all"
                >
                  <Paperclip size={20}/>
                </button>
                <button 
                  type="button" 
                  onClick={startListening} 
                  className={`p-3.5 rounded-full transition-all shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-400 hover:text-red-500'}`}
                >
                  <Mic size={20}/>
                </button>
                <input 
                  className="flex-1 bg-transparent px-4 py-3 text-sm font-semibold outline-none text-slate-700 placeholder:text-slate-300" 
                  value={localInput} 
                  onChange={(e) => setLocalInput(e.target.value)} 
                  placeholder="Ask anything or paste a complex topic..." 
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !localInput.trim()} 
                  className="p-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
                >
                  <Send size={20}/>
                </button>
              </form>
              {attachedFile && (
                <div className="mt-3 flex items-center gap-2 ml-4">
                  <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                    <Paperclip size={12} className="text-indigo-600" />
                    <span className="text-[10px] font-bold text-indigo-700 truncate max-w-[150px]">{attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)}><X size={12} className="text-indigo-400 hover:text-indigo-600" /></button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// MANDATORY Suspense wrapper for Vercel deployment
export default function AssistantHubPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-violet-600" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Initializing Hub</p>
        </div>
      </div>
    }>
      <AssistantContent />
    </Suspense>
  );
}
