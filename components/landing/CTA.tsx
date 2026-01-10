'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';

export default function CTA() {
    return (
        <section className="relative py-32 px-6 overflow-hidden bg-[#0f172a]">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-black/40 pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 backdrop-blur-3xl" />

                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-20 text-center">
                        <div className="inline-flex justify-center mb-6">
                            <div className="p-3 rounded-full bg-white/10 mb-4">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Ready to transform your grades?
                        </h2>
                        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
                            Join thousands of students who are already learning smarter, not harder.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <SignUpButton mode="modal">
                                <button className="w-full sm:w-auto px-8 py-5 rounded-full bg-violet-600 text-white font-bold text-lg hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer">
                                    Start Learning
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </SignUpButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
