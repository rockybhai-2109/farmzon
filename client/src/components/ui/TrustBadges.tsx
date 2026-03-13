'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, Star, Award } from 'lucide-react';

interface BadgeProps {
    type: 'verified' | 'organic' | 'top_rated' | 'premium';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const TrustBadge: React.FC<BadgeProps> = ({ type, size = 'md', showLabel = true }) => {
    const configs = {
        verified: {
            icon: ShieldCheck,
            color: 'from-blue-500 to-cyan-400',
            label: 'Verified Farmer',
            glow: 'shadow-blue-500/20'
        },
        organic: {
            icon: Leaf,
            color: 'from-emerald-500 to-green-400',
            label: '100% Organic',
            glow: 'shadow-emerald-500/20'
        },
        top_rated: {
            icon: Star,
            color: 'from-amber-400 to-orange-400',
            label: 'Top Rated',
            glow: 'shadow-amber-500/20'
        },
        premium: {
            icon: Award,
            color: 'from-purple-600 to-indigo-500',
            label: 'Premium Seller',
            glow: 'shadow-purple-500/20'
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'p-1 text-[10px] gap-1',
        md: 'p-1.5 text-xs gap-1.5',
        lg: 'p-2 text-sm gap-2'
    };

    const iconSizes = {
        sm: 12,
        md: 16,
        lg: 20
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`
        relative flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20
        ${sizeClasses[size]} ${config.glow} shadow-lg group overflow-hidden
      `}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-20 group-hover:opacity-30 transition-opacity`} />

            <div className={`relative flex items-center justify-center p-1 rounded-full bg-gradient-to-br ${config.color} text-white shadow-sm`}>
                <Icon size={iconSizes[size]} />
            </div>

            {showLabel && (
                <span className="relative pr-2 font-black tracking-tight text-white/90 uppercase italic">
                    {config.label}
                </span>
            )}

            {/* Shine effect */}
            <motion.div
                animate={{
                    x: ['-100%', '200%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 2
                }}
                className="absolute top-0 bottom-0 w-8 bg-white/20 skew-x-[45deg] pointer-events-none"
            />
        </motion.div>
    );
};
