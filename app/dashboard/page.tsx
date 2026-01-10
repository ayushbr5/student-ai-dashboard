import { syncStudent } from "@/lib/sync-student";
import { 
  BookOpen, 
  BrainCircuit, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  Clock,
  LayoutGrid,
  TrendingUp,
  Search
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const student = await syncStudent();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-500">
      
      {/* 1. Dynamic Greeting Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            Welcome, <span className="text-blue-600">{student?.name?.split(" ")[0] || "Scholar"}</span>! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">Ready to master your subjects with AI?</p>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><TrendingUp size={18} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Current Streak</p>
              <p className="text-sm font-bold text-slate-800">5 Days</p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Primary AI Study Modules */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid size={14} /> Recommended Tools
          </h2>
          <Link href="/dashboard/tools" className="text-xs font-bold text-blue-600 hover:underline">View All Tools</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Math Storyteller */}
          <Link href="/dashboard/tools#eli5" className="bg-white p-6 rounded-[32px] border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Math Storyteller</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Convert boring equations into personalized stories based on your interests.</p>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-wider">
              Launch Module <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Smart Quizzer */}
          <Link href="/dashboard/quiz" className="bg-white p-6 rounded-[32px] border border-slate-200 hover:shadow-xl hover:border-emerald-400 transition-all group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Quizzer</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Generate adaptive tests from your notes to identify your knowledge gaps.</p>
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-wider">
              Practice Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Syllabus Buddy */}
          <Link href="/dashboard/story" className="bg-white p-6 rounded-[32px] border border-slate-200 hover:shadow-xl hover:border-purple-400 transition-all group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Syllabus Buddy</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Upload your curriculum and generate a step-by-step AI study roadmap.</p>
            <div className="flex items-center gap-2 text-purple-600 text-xs font-black uppercase tracking-wider">
              Open Buddy <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Recent Activity & Saved Results */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-blue-500" size={18} /> Recent Sessions
            </h2>
            <Link href="/dashboard/downloads" className="text-xs font-bold text-slate-400 hover:text-blue-600">History</Link>
          </div>
          
          <div className="space-y-4">
            {/* Sample Recent Item */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-blue-600"><Sparkles size={16}/></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Pythagorean Theorem Story</p>
                  <p className="text-[10px] font-medium text-slate-400">Concept Simplifier • 2 hours ago</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-300" />
            </div>
          </div>
        </div>

        {/* Motivational Sidebar Card */}
        <div className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-4 leading-tight uppercase">Analyze Your <br/> Study Progress</h2>
            <p className="text-blue-100 text-sm font-medium mb-6">You've mastered 3 topics this week. Check your quiz history to see where you can improve next.</p>
          </div>
          <button className="relative z-10 w-fit bg-white text-blue-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-blue-50 transition-colors">
            View Analytics
          </button>
          {/* Decorative SVG Sparkles Background */}
          <Sparkles size={120} className="absolute -bottom-4 -right-4 text-blue-500/50 rotate-12" />
        </div>
      </section>
    </div>
  );
}