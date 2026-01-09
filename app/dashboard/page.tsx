import { syncStudent } from "@/lib/sync-student";
import { UserButton } from "@clerk/nextjs";
import { 
  BookOpen, 
  BrainCircuit, 
  MessageSquare, 
  Sparkles, 
  ArrowRight 
} from "lucide-react";

export default async function DashboardPage() {
  // 1. Sync the student with Neon
  const student = await syncStudent();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar for Dashboard */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Sparkles className="fill-blue-600" />
          <span>EduAI Student</span>
        </div>
        <UserButton />
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {/* Welcome Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {student?.name?.split(" ")[0] || "Scholar"}! 👋
          </h1>
          <p className="text-slate-500 mt-2">What would you like to learn today?</p>
        </header>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* AI Tutor Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">AI Math Storyteller</h2>
            <p className="text-slate-600 text-sm mb-6">Turn complex word problems into fun, personalized adventures based on your interests.</p>
            <button className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
              Start Session <ArrowRight size={16} />
            </button>
          </div>

          {/* Quiz Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
              <BrainCircuit className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Smart Quizzer</h2>
            <p className="text-slate-600 text-sm mb-6">AI-generated quizzes that adapt to your knowledge level to help you master any subject.</p>
            <button className="flex items-center gap-2 text-emerald-600 font-medium text-sm group-hover:gap-3 transition-all">
              Practice Now <ArrowRight size={16} />
            </button>
          </div>

          {/* Syllabus Buddy Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Syllabus Buddy</h2>
            <p className="text-slate-600 text-sm mb-6">Upload your syllabus and let AI guide you through your study plan step-by-step.</p>
            <button className="flex items-center gap-2 text-purple-600 font-medium text-sm group-hover:gap-3 transition-all">
              Open Buddy <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}