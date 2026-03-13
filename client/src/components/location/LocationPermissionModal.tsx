'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface LocationPermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAllow: () => void;
}

export default function LocationPermissionModal({ isOpen, onClose, onAllow }: LocationPermissionModalProps) {
    const { t, language } = useLanguage();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm overflow-hidden bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl"
                >
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            📍
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 font-display">
                            {language === 'gu' ? 'તમારું સ્થાન શોધો' : 'अपनी लोकेशन ढूंढें'}
                        </h2>

                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                            {language === 'gu'
                                ? 'તમારા નજીકના ખેડૂતો અને ચોક્કસ ડિલિવરી માટે લોકેશન ચાલુ કરો. અમે આ ડેટા સુરક્ષિત રાખીએ છીએ.'
                                : 'अपने नजदीकी किसानों और सटीक डिलीवरी के लिए लोकेशन चालू करें। हम इस डेटा को सुरक्षित रखते हैं।'}
                        </p>

                        <div className="space-y-4 text-left mb-8 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                            {[
                                { icon: '🚚', gu: 'ચોક્કસ ડિલિવરી માટે', en: 'For accurate delivery' },
                                { icon: '🧑‍🌾', gu: 'નજીકના ખેડૂતો શોધવા', en: 'Find nearby farmers' },
                                { icon: '📉', gu: 'તમારા નજીકના મંડી ભાવ', en: 'Local mandi prices' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                        {language === 'gu' ? item.gu : item.en}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onAllow}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-green-600/20"
                            >
                                {language === 'gu' ? 'મંજૂરી આપો' : 'अनुमति दें'}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-4 text-gray-400 dark:text-zinc-500 font-bold text-sm hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                            >
                                {language === 'gu' ? 'પછી કરીશું' : 'बाद में'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
