'use client';

import { UserProfile } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center p-6 h-full"
        >
            <UserProfile
                appearance={{
                    elements: {
                        rootBox: "w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border border-slate-200",
                        card: "w-full shadow-none rounded-none",
                        navbar: "hidden", // Simplify if you want, or keep it.
                        navbarButton: "text-slate-600 hover:text-slate-900",
                        headerTitle: "text-2xl font-bold text-slate-900",
                        headerSubtitle: "text-slate-500"
                    }
                }}
            />
        </motion.div>
    );
}
