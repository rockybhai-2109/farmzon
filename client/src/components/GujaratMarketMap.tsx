'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const REGIONS = [
    {
        id: 'north', name_gu: 'ઉત્તર ગુજરાત', name_hi: 'उत्तर गुजरात', name_en: 'North Gujarat', districts: [
            { name: 'Mehsana', price: 62 }, { name: 'Patan', price: 58 }, { name: 'Sabarkantha', price: 65 }
        ]
    },
    {
        id: 'central', name_gu: 'મધ્ય ગુજરાત', name_hi: 'मध्य गुजरात', name_en: 'Central Gujarat', districts: [
            { name: 'Ahmedabad', price: 70 }, { name: 'Anand', price: 68 }, { name: 'Kheda', price: 64 }
        ]
    },
    {
        id: 'south', name_gu: 'દક્ષિણ ગુજરાત', name_hi: 'दक्षिण गुजरात', name_en: 'South Gujarat', districts: [
            { name: 'Surat', price: 74 }, { name: 'Vadodara', price: 66 }, { name: 'Navsari', price: 72 }
        ]
    },
    {
        id: 'saurashtra', name_gu: 'સૌરાષ્ટ્ર', name_hi: 'सौराष्ट्र', name_en: 'Saurashtra', districts: [
            { name: 'Rajkot', price: 60 }, { name: 'Bhavnagar', price: 55 }, { name: 'Junagadh', price: 57 }
        ]
    },
    {
        id: 'kutch', name_gu: 'કચ્છ', name_hi: 'कच्छ', name_en: 'Kutch', districts: [
            { name: 'Bhuj', price: 52 }, { name: 'Gandhidham', price: 54 }
        ]
    }
];

export default function GujaratMarketMap() {
    const { t, language } = useLanguage();

    const maxPrice = 74;
    const minPrice = 52;

    const getColor = (price: number) => {
        if (price >= 70) return 'var(--destructive)'; // High - Red
        if (price >= 60) return 'var(--secondary)'; // Medium - Orange
        return 'var(--primary)'; // Low - Green
    };

    const getTrendIcon = (price: number) => {
        if (price > 65) return <TrendingUp className="w-3 h-3" />;
        if (price < 55) return <TrendingDown className="w-3 h-3" />;
        return <Minus className="w-3 h-3" />;
    };

    return (
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3D2B1F' }}>{t('market_map_title')}</h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span> {t('highest_prices_today')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></span> {t('lowest_prices_today')}</div>
                </div>
            </div>

            {/* Visual Text Map - rough geogrpahic layout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative', padding: '20px 0' }}>

                {/* 1. North */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 800, marginBottom: '8px' }}>{t('north_gujarat')}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {REGIONS.find(r => r.id === 'north')?.districts.map((d, i) => (
                            <motion.div
                                key={d.name}
                                whileHover={{ scale: 1.1, y: -5 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-lg cursor-pointer"
                                style={{ background: getColor(d.price) }}
                            >
                                <span>{d.name}</span>
                                <span className="opacity-60">₹{d.price}</span>
                                {getTrendIcon(d.price)}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 2. Middle Row: Kutch | Central */}
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 800, marginBottom: '8px' }}>{t('kutch_region')}</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {REGIONS.find(r => r.id === 'kutch')?.districts.map((d, i) => (
                                <motion.div
                                    key={d.name}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + (i * 0.05) }}
                                    className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-lg cursor-pointer"
                                    style={{ background: getColor(d.price) }}
                                >
                                    <span>{d.name}</span>
                                    <span className="opacity-60">₹{d.price}</span>
                                    {getTrendIcon(d.price)}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 800, marginBottom: '8px' }}>{t('central_gujarat')}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {REGIONS.find(r => r.id === 'central')?.districts.map((d, i) => (
                                <motion.div
                                    key={d.name}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + (i * 0.05) }}
                                    className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-lg cursor-pointer"
                                    style={{ background: getColor(d.price) }}
                                >
                                    <span>{d.name}</span>
                                    <span className="opacity-60">₹{d.price}</span>
                                    {getTrendIcon(d.price)}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Row: Saurashtra | South */}
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 800, marginBottom: '8px' }}>{t('saurashtra')}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '300px' }}>
                            {REGIONS.find(r => r.id === 'saurashtra')?.districts.map((d, i) => (
                                <motion.div
                                    key={d.name}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + (i * 0.05) }}
                                    className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-lg cursor-pointer"
                                    style={{ background: getColor(d.price) }}
                                >
                                    <span>{d.name}</span>
                                    <span className="opacity-60">₹{d.price}</span>
                                    {getTrendIcon(d.price)}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 800, marginBottom: '8px' }}>{t('south_gujarat')}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {REGIONS.find(r => r.id === 'south')?.districts.map((d, i) => (
                                <motion.div
                                    key={d.name}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + (i * 0.05) }}
                                    className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-lg cursor-pointer"
                                    style={{ background: getColor(d.price) }}
                                >
                                    <span>{d.name}</span>
                                    <span className="opacity-60">₹{d.price}</span>
                                    {getTrendIcon(d.price)}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
