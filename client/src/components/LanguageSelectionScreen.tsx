'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, Check } from 'lucide-react';

const languages = [
    {
        code: 'gu',
        label: 'ગુજરાતી',
        subLabel: 'Gujarati',
        icon: '🌾',
        recommended: true
    },
    {
        code: 'hi',
        label: 'हिंदी',
        subLabel: 'Hindi',
        icon: '🇮🇳',
        recommended: false
    },
    {
        code: 'en',
        label: 'English',
        subLabel: 'English',
        icon: '🌐',
        recommended: false
    }
];

export const LanguageSelectionScreen = () => {
    const { language, setLanguage, isFirstVisit, completeFirstVisit } = useLanguage();

    if (!isFirstVisit) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
            >
                <div className="w-full max-w-lg px-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-10"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Globe className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {language === 'gu' ? 'તમારી ભાષા પસંદ કરો' :
                                language === 'hi' ? 'अपनी भाषा चुनें' : 'Choose Your Language'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {language === 'gu' ? 'કિસાનમાર્ટમાં તમારું સ્વાગત છે' :
                                language === 'hi' ? 'किसानमार्ट में आपका स्वागत है' : 'Welcome to KisanMart'}
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {languages.map((lang, idx) => (
                            <motion.button
                                key={lang.code}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                onClick={() => setLanguage(lang.code as any)}
                                className={`w-full relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 ${language === lang.code
                                        ? 'border-green-600 bg-green-50 shadow-md'
                                        : 'border-gray-200 bg-white hover:border-green-200'
                                    }`}
                            >
                                <div className="text-3xl mr-4">{lang.icon}</div>
                                <div className="text-left flex-1">
                                    <div className="text-xl font-bold text-gray-900 leading-tight">
                                        {lang.label}
                                    </div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                                        {lang.subLabel}
                                    </div>
                                </div>

                                {language === lang.code && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"
                                    >
                                        <Check className="w-5 h-5 text-white" />
                                    </motion.div>
                                )}

                                {lang.recommended && (
                                    <div className="absolute -top-3 right-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                                        Recommended
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={completeFirstVisit}
                        className="w-full mt-10 py-5 bg-green-600 text-white rounded-2xl text-xl font-bold shadow-xl shadow-green-100 hover:bg-green-700 transition-all transform active:scale-[0.98]"
                    >
                        {language === 'gu' ? 'આગળ વધો' :
                            language === 'hi' ? 'आगे बढ़ें' : 'Continue'}
                    </motion.button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
