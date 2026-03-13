'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import gu from '@/i18n/languages/gu.json';
import hi from '@/i18n/languages/hi.json';
import en from '@/i18n/languages/en.json';

type Language = 'gu' | 'hi' | 'en';

const translations = { gu, hi, en };

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    isFirstVisit: boolean;
    completeFirstVisit: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('gu');
    const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedLang = localStorage.getItem('kisanmart_lang') as Language;
        const hasVisited = localStorage.getItem('kisanmart_visited');

        if (savedLang && ['gu', 'hi', 'en'].includes(savedLang)) {
            setLanguageState(savedLang);
            setIsFirstVisit(false);
        } else {
            // Suggest language based on browser
            const browserLang = navigator.language.split('-')[0];
            if (browserLang === 'hi') {
                setLanguageState('hi');
            } else if (browserLang === 'gu') {
                setLanguageState('gu');
            } else {
                setLanguageState('gu'); // Default to Gujarati
            }
            setIsFirstVisit(!hasVisited);
        }
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        // Update document lang and body class for global font application
        document.documentElement.lang = language;
        document.body.classList.remove('font-gu', 'font-hi');
        if (language === 'gu') document.body.classList.add('font-gu');
        if (language === 'hi') document.body.classList.add('font-hi');
    }, [language, isMounted]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('kisanmart_lang', lang);
        // If they set a language, they've effectively completed their first visit choice
        if (isFirstVisit) {
            completeFirstVisit();
        }
    };

    const completeFirstVisit = () => {
        setIsFirstVisit(false);
        localStorage.setItem('kisanmart_visited', 'true');
    };

    const t = (key: string, params?: Record<string, string | number>) => {
        const dict = translations[language] as Record<string, string>;
        const fallback = translations['en'] as Record<string, string>;

        let str = dict[key] || fallback[key] || key;

        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
            });
        }
        return str;
    };

    // Prevent hydration mismatch
    if (!isMounted) return null;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isFirstVisit, completeFirstVisit }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
