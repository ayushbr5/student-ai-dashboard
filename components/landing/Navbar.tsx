'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    GraduationCap
} from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10 py-4 shadow-sm'
                : 'bg-transparent py-6 border-b border-slate-900/10'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/30 transition-all duration-300">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <span className={`text-xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-white' : 'text-slate-900'}`}>
                        StudentAI
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'Tools', 'About'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={(e) => scrollToSection(e, item.toLowerCase())}
                            className={`transition-colors font-medium ${isScrolled
                                ? 'text-gray-300 hover:text-white'
                                : 'text-slate-900 hover:text-indigo-600 font-bold'
                                }`}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <SignInButton mode="modal">
                        <button className={`px-6 py-2.5 rounded-full border-2 transition-all font-bold text-sm cursor-pointer ${isScrolled
                            ? 'border-white/20 text-white hover:bg-white/10'
                            : 'border-slate-900 text-slate-900 hover:bg-slate-100 hover:shadow-md'
                            }`}>
                            Log In
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent">
                            Sign Up
                        </button>
                    </SignUpButton>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden ${isScrolled ? 'text-white' : 'text-slate-900'}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#0f172a] border-b border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {['Features', 'Tools', 'About'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={(e) => scrollToSection(e, item.toLowerCase())}
                                    className="text-lg text-white font-medium hover:text-indigo-400"
                                >
                                    {item}
                                </a>
                            ))}

                            <div className="flex flex-col gap-3 mt-4">
                                <SignInButton mode="modal">
                                    <button className="w-full py-3 rounded-xl border border-white/20 text-white font-medium cursor-pointer">
                                        Log In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="w-full py-3 rounded-xl bg-violet-600 text-white font-medium cursor-pointer">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
