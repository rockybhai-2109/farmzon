'use client';

import React from 'react';
import { Sprout, Sun, Droplets, User, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImpactBadgeProps {
    type: 'organic' | 'solar' | 'drip' | 'women' | 'certified' | 'fresh';
    label?: string;
}

const badgeConfig = {
    organic: { icon: Sprout, color: 'bg-green-100 text-green-700 border-green-200', text: '100% Organic' },
    solar: { icon: Sun, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Solar Powered' },
    drip: { icon: Droplets, color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Drip Irrigation' },
    women: { icon: User, color: 'bg-purple-100 text-purple-700 border-purple-200', text: 'Women-Led' },
    certified: { icon: ShieldCheck, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Certified' },
    fresh: { icon: Zap, color: 'bg-orange-100 text-orange-700 border-orange-200', text: 'Fresh Harvest' },
};

export const ImpactBadges = ({ type, label }: ImpactBadgeProps) => {
    const config = badgeConfig[type];
    const Icon = config.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${config.color} text-[10px] font-black uppercase tracking-widest shadow-sm transition-shadow hover:shadow-md cursor-default`}
        >
            <Icon className="w-3.5 h-3.5" />
            <span>{label || config.text}</span>
        </motion.div>
    );
};
