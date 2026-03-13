'use client';

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';
import LocationPermissionModal from './LocationPermissionModal';
import { motion } from 'framer-motion';

export default function LocationButton() {
    const { setIsLoading, isLoading, reverseGeocode } = useLocation();
    const { language } = useLanguage();
    const [status, setStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
    const [showModal, setShowModal] = useState(false);

    const handleLocate = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setStatus('locating');
        setIsLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const result = await reverseGeocode(latitude, longitude, language);
                if (result) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            },
            (error) => {
                console.error('GPS error', error);
                setStatus('error');
                setIsLoading(false);
                if (error.code === 1) { // Permission denied
                    setShowModal(true);
                }
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const labels = {
        idle: language === 'gu' ? '📍 મારું સ્થળ શોધો' : '📍 मेरी लोकेशन ढूंढें',
        locating: language === 'gu' ? '⌛ GPS signal શોધી રહ્યા...' : '⌛ GPS signal ढूंढ रहे हैं...',
        success: language === 'gu' ? '✅ સ્થળ મળી ગયું!' : '✅ लोकेशन मिल गई!',
        error: language === 'gu' ? '❌ ફરી પ્રયાસ કરો' : '❌ फिर कोशिश करें'
    };

    return (
        <>
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLocate}
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 border-2 ${status === 'success'
                    ? 'bg-green-50 text-green-700 border-green-500'
                    : status === 'locating'
                        ? 'bg-amber-50 text-amber-600 border-amber-300'
                        : 'bg-white text-green-700 border-green-600 hover:bg-green-50'
                    }`}
            >
                {status === 'locating' && (
                    <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                        ⌛
                    </motion.span>
                )}
                {labels[status]}
            </motion.button>

            <LocationPermissionModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onAllow={() => {
                    setShowModal(false);
                    handleLocate();
                }}
            />
        </>
    );
}
