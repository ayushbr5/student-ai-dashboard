'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const stats = [
    { label: "Active Students", value: "10,000+" },
    { label: "Quizzes Taken", value: "500K+" },
    { label: "Hours Saved", value: "1M+" },
];

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "High School Student",
        text: "StudentAI saved my grades in Calculus. The AI Math Storyteller made concepts click in a way my textbooks never did.",
        avatar: "S",
        gradient: "from-orange-500 to-red-500"
    },
    {
        name: "Michael Chen",
        role: "Middle School Parent",
        text: "My son used to hate studying history. Now he uses the Historical Figure chat every day. It's safe, fun, and educational.",
        avatar: "M",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        name: "Emily Davis",
        role: "College Freshman",
        text: "The Note Summarizer and Socratic Hint Bot are lifesavers for my study sessions. Highly recommended for any serious student.",
        avatar: "E",
        gradient: "from-violet-500 to-purple-500"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 relative overflow-hidden bg-white/5 backdrop-blur-3xl">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 max-w-6xl">

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center px-4 py-4">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Loved by Students & Parents</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-gray-900/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col shadow-lg hover:border-white/20 transition-colors"
                        >
                            <div className="flex gap-1 text-yellow-500 mb-6">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                            </div>

                            <p className="text-gray-300 text-lg mb-8 flex-grow leading-relaxed">"{t.text}"</p>

                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full bg-linear-to-tr ${t.gradient} flex items-center justify-center text-white font-bold text-xl`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{t.name}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}