'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, FileCheck, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface CertProps {
    title: string;
    issuer: string;
    date: string;
    type: 'organic' | 'verified' | 'identity';
}

const CertItem: React.FC<CertProps> = ({ title, issuer, date, type }) => {
    const iconMap = {
        organic: Leaf,
        verified: ShieldCheck,
        identity: User
    };

    // Actually let's use Lucide icons consistently
    const Icon = type === 'organic' ? CheckCircle2 : type === 'verified' ? ShieldCheck : Award;

    return (
        <motion.div
            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 transition-colors"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${type === 'organic' ? 'from-emerald-500 to-teal-400' :
                    type === 'verified' ? 'from-blue-500 to-indigo-400' :
                        'from-amber-400 to-orange-400'} text-white shadow-lg`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm">{title}</h4>
                <p className="text-[11px] text-white/50 font-medium uppercase tracking-wider">{issuer} • {date}</p>
            </div>
            <div className="ml-auto">
                <div className="px-2 py-1 rounded-md bg-white/10 text-[10px] font-black text-[#C5E063] uppercase">Active</div>
            </div>
        </motion.div>
    );
};

// Re-defining icons since I can't import within this block easily if they aren't available
const Leaf = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.3 0 0-1 1.2-3 1.2s-3-1-4-1 1 5-2 8.5Z" /><path d="M11 20c2.5 0 2.5-14.5 2.5-14.5" /></svg>
);
const User = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

export const CertificationBoard: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Award size={18} className="text-[#C5E063]" />
                <h3 className="font-serif font-black text-white text-lg italic uppercase tracking-tight">Certification Board</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CertItem
                    type="organic"
                    title="NPOP Organic Certified"
                    issuer="Gujarat Organic Board"
                    date="2024-2025"
                />
                <CertItem
                    type="verified"
                    title="Verified Farmer Status"
                    issuer="KisanMart Platform"
                    date="Mar 2024"
                />
                <CertItem
                    type="identity"
                    title="Identity Verified (Aadhar)"
                    issuer="Govt of India"
                    date="Verified"
                />
                <CertItem
                    type="verified"
                    title="Soil Quality Approved"
                    issuer="District Agri Lab"
                    date="Jan 2024"
                />
            </div>

            <div className="p-4 rounded-2xl bg-[#C5E063]/10 border border-[#C5E063]/20 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C5E063] flex items-center justify-center text-[#3D2B1F]">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <p className="text-xs font-bold text-[#C5E063]">Trust Score: 98/100</p>
                    <p className="text-[10px] text-[#C5E063]/70">Based on 45 successful orders & 0 disputes.</p>
                </div>
            </div>
        </div>
    );
};
