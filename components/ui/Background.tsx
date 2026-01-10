'use client';

export default function Background() {
    return (
        <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none bg-white dark:bg-[#020617] transition-colors duration-300">
            {/* Optional: Very subtle noise or pattern if requested later, but currently strictly 'clean off-white' */}
        </div>
    );
}
