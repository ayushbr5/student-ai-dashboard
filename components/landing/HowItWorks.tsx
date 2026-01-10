'use client';

import { motion } from 'framer-motion';
import { MousePointerClick, FileEdit, Download } from 'lucide-react';

const steps = [
    {
        icon: MousePointerClick,
        title: "Select Your AI Tool",
        description: "Choose from 10+ specialized assistants like the AI Math Storyteller or Concept Simplifier to start your session."
    },
    {
        icon: FileEdit,
        title: "Interact & Refine in Notepad",
        description: "Use the Integrated Notepad to brainstorm, rewrite, or summarize the AI's response directly on the screen."
    },
    {
        icon: Download,
        title: "Download & Conquer",
        description: "Once your notes are perfect, use the Download option to save your work as a PDF or text file for offline study."
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 relative bg-[#0f172a]">
            <div className="container mx-auto px-6 max-w-6xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
                    <p className="text-slate-200 max-w-2xl mx-auto text-lg font-medium">
                        Getting started with StudentAI is as easy as 1-2-3.
                    </p>
                </motion.div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl group-hover:bg-violet-500/40 transition-all duration-500" />
                                <div className="relative w-full h-full bg-[#0f172a] border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:border-violet-500/60 z-10 shadow-lg">
                                    <step.icon className="w-10 h-10 text-violet-400 group-hover:text-white transition-colors" />
                                </div>

                                {/* Step Number Badge */}
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold border-4 border-[#0f172a] z-20 shadow-md">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-slate-300 leading-relaxed px-4 font-medium">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
