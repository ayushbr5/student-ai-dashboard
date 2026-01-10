'use client';

import { motion } from 'framer-motion';

export default function About() {
    return (
        <section id="about" className="py-20 md:py-32 relative overflow-hidden bg-[#0f172a]">
            <div className="container mx-auto px-6 max-w-4xl text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h3 className="text-3xl md:text-5xl font-medium text-white leading-tight mb-12">
                        We believe that every student deserves a <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400 font-bold">personalized tutor </span>
                        that understands exactly how they learn best.
                    </h3>

                    <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium">
                        "StudentAI isn't just about answers—it's about understanding. We're building the future of education where AI empowers you to think critically, solve problems creatively, and learn continuously."
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
