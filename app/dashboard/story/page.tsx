'use client';


import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompletion, useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Wand2, Loader2, AlertCircle, MessageSquare, BookOpen, Mic, Send, Bot, Volume2, StopCircle, Paperclip, X } from 'lucide-react';

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState<'storyteller' | 'chat'>('storyteller');
  const [systemRole, setSystemRole] = useState("You are a helpful AI assistant.");

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

  // General Chat Hook
  // useChat return values are apparently unstable in this env, so we only rely on messages/append/loading
  // General Chat State (Manual for Gemini-like feel)
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Hello! I am your AI study companion. I can help you with homework, explain complex topics, or just chat. How can I help you today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<Error | null>(null);

  // Helper for ID generation
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Ensure Initial Greeting
  // Removed automatic effect since we initialize state directly above

  // Manual Input State (Robustness Fix)
  // We manage input manually to avoid 'undefined' crashes from the hook
  const [localInput, setLocalInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll logic
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Voice Input Logic
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLocalInput(transcript);
        // Optional: Auto-submit on voice end? For now, let user review.
      };

      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  // Text-To-Speech
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      // utterance.lang = 'en-US'; // Default
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // File Attachment Logic
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const clearAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Manual Send Handler
  // Manual Send Handler with Streaming
  const handleSend = async (e?: React.FormEvent, manualPrompt?: string) => {
    e?.preventDefault();
    const prompt = manualPrompt || localInput;
    if (!prompt.trim()) return;

    // 1. Optimistic UI: Add User Message
    const userMsg = {
      id: generateId(),
      role: 'user',
      content: attachedFile ? `[Attached: ${attachedFile.name}] ${prompt}` : prompt
    };
    setMessages(prev => [...prev, userMsg]);
    setLocalInput(''); // Clear input immediately
    setAttachedFile(null); // Clear attachment
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
    setIsLoading(true);
    setChatError(null);

    try {
      // 2. Prepare API Call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg], // Send context
          systemRole
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");
      if (!response.body) throw new Error("No response body");

      // 3. Setup Stream Reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMsgId = generateId();
      let aiContent = "";

      // Add placeholder AI message
      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: "" }]);

      // 4. Read Stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;

        // Update the last message (AI) with new content
        setMessages(prev => prev.map(msg =>
          msg.id === aiMsgId ? { ...msg, content: aiContent } : msg
        ));
      }
    } catch (err: any) {
      console.error("Chat Error:", err);
      setChatError(err);
      // Optional: Add error message to chat
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 'Enter' key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">

      {/* Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-xl">
              <Bot className="w-8 h-8 text-violet-600" />
            </div>
            AI Assistant Hub
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Choose your learning companion</p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
          <button
            onClick={() => setActiveTab('storyteller')}
            className={`relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'storyteller' ? 'text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
            {activeTab === 'storyteller' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-violet-600 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Storyteller
            </span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'chat' ? 'text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
            {activeTab === 'chat' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-600 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> General Chat
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">

        {/* STORYTELLER VIEW */}
        {activeTab === 'storyteller' && (
          <motion.div
            key="storyteller"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                  </div>
                  <h2 className="font-bold text-lg text-slate-800">Transform Math</h2>
                </div>
                <textarea
                  className="w-full p-4 rounded-xl border border-slate-200 mb-4 h-40 focus:ring-2 focus:ring-violet-500 outline-none text-slate-700 bg-slate-50 font-medium resize-none transition-all focus:bg-white"
                  placeholder="Paste a boring math problem here... (e.g. Solve for x: 2x + 4 = 10)"
                  value={storyInput}
                  onChange={handleStoryInputChange}
                />
                <button
                  onClick={() => complete(storyInput)}
                  disabled={isStoryLoading || !storyInput}
                  className="w-full bg-violet-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-violet-500/20 active:scale-95"
                >
                  {isStoryLoading ? (
                    <><Loader2 className="animate-spin w-5 h-5" /> weaving spell...</>
                  ) : (
                    <><Wand2 className="w-5 h-5" /> Turn into Story</>
                  )}
                </button>
                {storyError && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex gap-2 items-center text-sm font-medium border border-red-100">
                    <AlertCircle size={16} />
                    <span>{storyError.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="relative min-h-[400px]">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-xl rounded-3xl border border-slate-200/60" />
              {completion ? (
                <div className="relative bg-white p-8 rounded-3xl border border-violet-100 shadow-xl shadow-violet-500/5 h-full overflow-y-auto">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                    <BookOpen className="w-5 h-5 text-violet-500" />
                    <h2 className="font-bold text-slate-800 text-sm tracking-widest uppercase">Your Adventure</h2>
                  </div>
                  <p className="text-slate-700 leading-loose whitespace-pre-wrap text-lg font-medium">
                    {completion}
                  </p>
                </div>
              ) : (
                <div className="relative h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center bg-slate-50/50">
                  <Wand2 className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-medium">Magical story appears here...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CHATBOT VIEW */}
        {activeTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-[600px] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl shadow-blue-500/5 overflow-hidden relative"
          >
            {/* Chat Header / Settings */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-sm font-bold text-slate-700">Online Assistant</span>
              </div>

              {/* Tone Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setSystemRole("You are a strict but helpful academic tutor.")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${systemRole.includes("strict") ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  Tutor
                </button>
                <button
                  onClick={() => setSystemRole("You are a funny and casual study buddy. Use emojis.")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${systemRole.includes("funny") ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  Buddy
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">

              {/* Messages Map */}
              {messages.map((m: any) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-violet-600 text-white'
                    }`}>
                    {m.role === 'user' ? 'You' : <Bot size={16} />}
                  </div>
                  <div className={`flex flex-col gap-1 max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                      }`}>
                      {m.role === 'user' ? (
                        m.content
                      ) : (
                        <ReactMarkdown
                          components={{
                            strong: ({ node, ...props }) => <span className="font-bold text-slate-900" {...props} />
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    {/* TTS Button for Bot */}
                    {m.role === 'assistant' && (
                      <button
                        onClick={() => isSpeaking ? stopSpeaking() : speak(m.content)}
                        className="text-slate-400 hover:text-violet-600 transition-colors p-1"
                        title="Read Aloud"
                      >
                        {isSpeaking ? <StopCircle size={14} /> : <Volume2 size={14} />}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quick Prompts (Show if only greeting exists) */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mt-4 ml-12">
                  {[
                    "Explain Quantum Physics like I'm 5",
                    "Write a poem about Algebra",
                    "Tips for studying History"
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(undefined, prompt)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                    <span className="text-xs font-bold text-violet-500">Thinking</span>
                    <div className="flex gap-1">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-slate-100 relative">
              {/* Attachment Chip */}
              <AnimatePresence>
                {attachedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full left-4 mb-2 p-2 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2 shadow-sm"
                  >
                    <div className="p-1.5 bg-white rounded-md">
                      <Paperclip size={14} className="text-violet-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 max-w-[150px] truncate">{attachedFile.name}</span>
                    <button onClick={clearAttachment} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {chatError && (
                <div className="p-2 bg-red-50 text-red-500 text-xs font-bold text-center border-b border-red-100 flex items-center justify-center gap-2">
                  <AlertCircle size={12} />
                  <span>{chatError.message}</span>
                </div>
              )}
              <div className="p-4">
                <form onSubmit={handleSend} className="relative flex items-center gap-3">
                  {/* File Upload Button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.txt"
                  />
                  <motion.button
                    type="button"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
                    title="Attach File"
                  >
                    <Paperclip size={20} />
                  </motion.button>

                  <motion.button
                    type="button"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      boxShadow: isListening ? "0 0 0 4px rgba(220, 38, 38, 0.2)" : "none"
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startListening}
                    className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    <Mic size={20} className={isListening ? "animate-pulse" : ""} />
                  </motion.button>
                  <input
                    className="flex-1 bg-slate-50 text-slate-900 placeholder:text-slate-400 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-medium outline-none"
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your question..."
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !localInput.trim()}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}