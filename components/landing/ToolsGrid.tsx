'use client';

import { motion } from 'framer-motion';
import {
    Lightbulb,
    MessageSquare,
    Globe,
    Puzzle,
    GraduationCap,
    Edit3,
    Plus
} from 'lucide-react';

const tools = [
    {
        name: 'Concept Simplifier',
        icon: Lightbulb,
        description: "Break down complex topics into simple, digestible explanations that make sense instantly."
    },
    {
        name: 'Socratic Hint Bot',
        icon: MessageSquare,
        description: "Get guided learning through questions that help you solve problems yourself without giving the answer."
    },
    {
        name: 'Real-World Math',
        icon: Globe,
        description: "See how abstract mathematical concepts apply to real-life scenarios and everyday situations."
    },
    {
        name: 'Problem Decoder',
        icon: Puzzle,
        description: "Scan any homework problem and get a step-by-step breakdown of how to approach and solve it."
    },
    {
        name: 'AI Study Buddy',
        icon: GraduationCap,
        description: "Your personal 24/7 tutor ready to quiz you, explain topics, and keep you on track."
    },
    {
        name: 'Grammar Polisher',
        icon: Edit3,
        description: "Elevate your writing with instant feedback on grammar, tone, and style improvements."
    }
];

export default function ToolsGrid() {
    return (
        <section id="tools" className="py-24 relative bg-[#0f172a] text-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider">Powerhouse</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        6 Specialized <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">AI Tools</span>
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg font-medium">
                        A complete toolkit designed to tackle every aspect of your academic journey.
                    </p>
                </motion.div>

                {/* Grid Layout: 1 col mobile, 2 tablet, 3 desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:border-violet-500/30 hover:bg-white/10 transition-all duration-300 flex flex-col h-full shadow-lg"
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 rounded-xl bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors text-violet-400 group-hover:text-violet-300 shrink-0">
                                    <tool.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{tool.name}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* "Many More" Card */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="group bg-gradient-to-br from-violet-900/20 to-indigo-900/20 backdrop-blur-sm border border-dashed border-white/10 p-6 rounded-2xl hover:border-violet-500/40 hover:bg-white/5 transition-all duration-300 flex flex-col items-center justify-center h-full min-h-[160px] cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/10 shadow-sm">
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400 group-hover:text-white transition-colors text-center">+ Many More Tools Inside</h3>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
