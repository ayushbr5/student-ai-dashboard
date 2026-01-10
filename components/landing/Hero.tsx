'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';

export default function Hero() {
    return (
        <>
            {/* White Section: Text & Buttons */}
            <section className="relative pt-32 pb-20 bg-white text-slate-900 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-multiply" />
                    <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-multiply" />
                </div>

                <div className="container mx-auto px-6 text-center z-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-8 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm text-slate-700 font-medium">New: AI Study Buddy 2.0 is live</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
                            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 animate-gradient-x">Smarter</span>,<br />
                            Not Harder
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                            The all-in-one AI learning platform designed to help students master any subject.
                            From math stories to concept simplifiers, unlock your full potential today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <SignUpButton mode="modal">
                                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-violet-600 text-white font-bold text-lg hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 group cursor-pointer">
                                    Start Learning
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </SignUpButton>
                            <button
                                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                See How It Works
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Dark Section: Dashboard Mockup */}
            <section className="relative pt-12 pb-24 bg-[#0f172a] text-white overflow-hidden">
                {/* Optional: Top Fade to ensure smooth transition if strictly needed, but user asked for sharp line above. 
                     We will keep it clean but maybe add a subtle top border or shadow if needed. 
                     For now, straight cut as requested. */}

                <div className="container mx-auto px-6 z-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 40, rotateX: 10 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative max-w-5xl mx-auto perspective-1000"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10 pointer-events-none" />

                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md group">
                            {/* Mockup Header */}
                            <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="ml-4 w-64 h-6 rounded-full bg-white/5" />
                            </div>

                            {/* Mockup Content Area */}
                            <div className="p-8 grid grid-cols-12 gap-6 h-[400px] md:h-[600px] relative">
                                {/* Sidebar */}
                                <div className="col-span-3 hidden md:block space-y-4">
                                    <div className="h-8 w-3/4 bg-white/10 rounded-lg animate-pulse" />
                                    <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                                    <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
                                    <div className="h-4 w-1/2 bg-white/5 rounded-lg" />

                                    <div className="mt-8 h-32 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-xl border border-white/5 p-4">
                                        <div className="w-8 h-8 rounded-full bg-violet-500/20 mb-2" />
                                        <div className="h-3 w-3/4 bg-white/10 rounded mb-1" />
                                        <div className="h-3 w-1/2 bg-white/10 rounded" />
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="col-span-12 md:col-span-9 space-y-6">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="h-10 w-1/3 bg-white/10 rounded-xl" />
                                        <div className="h-10 w-10 rounded-full bg-white/10" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="h-48 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5 p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-6 opacity-20">
                                                <div className="w-24 h-24 bg-violet-500 rounded-full blur-2xl" />
                                            </div>
                                            <div className="h-6 w-1/2 bg-white/10 rounded-lg mb-4" />
                                            <div className="space-y-2">
                                                <div className="h-3 w-full bg-white/5 rounded" />
                                                <div className="h-3 w-full bg-white/5 rounded" />
                                                <div className="h-3 w-2/3 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-48 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5 p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-6 opacity-20">
                                                <div className="w-24 h-24 bg-indigo-500 rounded-full blur-2xl" />
                                            </div>
                                            <div className="h-6 w-1/2 bg-white/10 rounded-lg mb-4" />
                                            <div className="space-y-2">
                                                <div className="h-3 w-full bg-white/5 rounded" />
                                                <div className="h-3 w-full bg-white/5 rounded" />
                                                <div className="h-3 w-2/3 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-64 rounded-2xl bg-white/5 border border-white/5 p-6 flex items-end">
                                        <div className="w-full flex items-end gap-4 h-32">
                                            <div className="flex-1 bg-violet-500/20 rounded-t-lg h-[40%]" />
                                            <div className="flex-1 bg-violet-500/40 rounded-t-lg h-[70%]" />
                                            <div className="flex-1 bg-violet-500/60 rounded-t-lg h-[50%]" />
                                            <div className="flex-1 bg-violet-500/80 rounded-t-lg h-[90%]" />
                                            <div className="flex-1 bg-violet-500/30 rounded-t-lg h-[60%]" />
                                            <div className="flex-1 bg-violet-500/50 rounded-t-lg h-[80%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-20 -right-12 bg-[#0f172a]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl hidden md:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                        <span className="font-bold">A+</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">Math Quiz Aced!</div>
                                        <div className="text-xs text-slate-400">Just now</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-40 -left-12 bg-[#0f172a]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl hidden md:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Play className="w-4 h-4 fill-current" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">History Story</div>
                                        <div className="text-xs text-slate-400">Listening...</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}