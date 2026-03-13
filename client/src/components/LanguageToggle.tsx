'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const langs = [
        { id: 'gu', label: 'ગુજરાતી', short: 'ગુ' },
        { id: 'hi', label: 'हिन्दी', short: 'हि' },
        { id: 'en', label: 'English', short: 'EN' },
    ] as const;

    return (
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1 backdrop-blur-md">
            {langs.map((l) => {
                const isActive = language === l.id;
                return (
                    <button
                        key={l.id}
                        onClick={() => setLanguage(l.id)}
                        className="relative px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer whitespace-nowrap overflow-hidden group"
                        style={{
                            color: isActive ? '#3D2B1F' : 'rgba(255,255,255,0.5)'
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-[#C5E063] rounded-lg shadow-lg shadow-[#C5E063]/20"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                            {isActive ? l.label : l.short}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
