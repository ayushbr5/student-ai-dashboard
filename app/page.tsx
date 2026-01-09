"use client";

import Link from 'next/link';
import { Sparkles, Wand2, Calculator, BookOpen, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">StudentAI</span>
        </div>
        <Link 
          href="/dashboard" 
          className="bg-slate-100 hover:bg-slate-200 px-5 py-2 rounded-full font-semibold transition-all"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="px-6 pt-16 pb-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6">
          <Sparkles size={16} /> 2026 AI Learning Partner
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Turn Boring Math into <span className="text-blue-600">Epic Adventures.</span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          The all-in-one AI assistant that converts math problems into stories, 
          provides smart tools, and helps you master concepts in minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard/story" 
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            Start Your Adventure <ArrowRight size={20} />
          </Link>
          <Link 
            href="/dashboard/tools" 
            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
          >
            Explore Tools
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section className="px-6 py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Wand2 className="text-blue-600" />}
              title="AI Storyteller"
              description="Convert complex equations into space missions or robot battles."
            />
            <FeatureCard 
              icon={<Calculator className="text-purple-600" />}
              title="Smart Tools"
              description="Access unit converters and geometry formula sheets instantly."
            />
            <FeatureCard 
              icon={<BookOpen className="text-orange-600" />}
              title="Step-by-Step"
              description="Don't just get the answer. Understand the logic behind every step."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}