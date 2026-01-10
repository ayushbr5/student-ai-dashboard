'use client';

import { motion } from 'framer-motion';
import { BookOpen, Trophy, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        title: "AI Math Storyteller",
        description: "Transform complex math problems into engaging stories. Visualize concepts like never before and retain information longer through narrative learning techniques designed to stick.",
        icon: BookOpen,
        color: "from-violet-600 to-indigo-600",
        bgGlow: "bg-violet-500/20",
        href: "#",
        delay: 0
    },
    {
        title: "Quiz Hub",
        description: "Generate interactive quizzes instantly from your notes or textbooks. Track your progress, identify weak spots, and master any subject with adaptive difficulty scaling.",
        icon: Trophy,
        color: "from-fuchsia-600 to-pink-600",
        bgGlow: "bg-fuchsia-500/20",
        href: "#",
        delay: 0.1
    }
];

export default function Features() {
    return (
        <section id="features" className="relative py-24 px-6 overflow-hidden bg-[#0f172a] text-white">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white"
                    >
                        Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Experiences</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 max-w-2xl mx-auto text-lg font-medium"
                    >
                        Dive deep into our two flagship learning modes designed to revolutionize how you understand and test your knowledge.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 100, damping: 20, delay: feature.delay }}
                            className="group relative h-full"
                        >
                            <div className="relative h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 hover:border-violet-500/30 transition-all duration-300 flex flex-col items-start overflow-hidden shadow-lg">

                                <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-300 leading-relaxed mb-8 flex-grow text-lg">
                                    {feature.description}
                                </p>

                                <Link
                                    href={feature.href}
                                    className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 border border-white/10 text-white font-medium hover:bg-white/20 transition-all group-hover:pl-8 group-hover:border-violet-500/30"
                                >
                                    Start Learning <ChevronRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
