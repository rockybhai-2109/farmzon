'use client';

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import LocationButton from './LocationButton';
import AddressAutocomplete from './AddressAutocomplete';
import { GUJARAT_DISTRICTS } from '@/data/gujaratData';

export default function LocationStrip() {
    const { userLocation, setUserLocation } = useLocation();
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const cityName = userLocation?.city || (language === 'gu' ? 'સ્થળ પસંદ કરો' : 'लोकेशन चुनें');

    return (
        <>
            {/* Premium Location Selector Strip */}
            <div className="w-full flex justify-between items-center py-2 mb-4" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', borderRadius: '16px', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-3">
                    <span style={{ fontSize: '22px' }}>📍</span>
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {language === 'gu' ? 'તમારું સ્થળ' : 'आपकी लोकेशन'}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: 'white' }}>{cityName}</div>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        background: '#C5E063',
                        color: '#3D2B1F',
                        padding: '6px 14px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 900,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {language === 'gu' ? 'બદલો' : 'बदलें'}
                </button>
            </div>

            {/* Bottom Sheet Switcher */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed', bottom: 0, left: 0, right: 0,
                                background: 'white', borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
                                zIndex: 1001, padding: '24px', maxHeight: '85vh', overflowY: 'auto',
                                boxShadow: '0 -10px 40px rgba(0,0,0,0.2)'
                            }}
                        >
                            {/* Handle Bar */}
                            <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '10px', margin: '0 auto 24px' }} />

                            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#3D2B1F', marginBottom: '20px' }}>
                                {language === 'gu' ? 'સ્થળ બદલો' : 'लोकेशन बदलें'}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <LocationButton />

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#6B7280', marginBottom: '8px' }}>
                                        {language === 'gu' ? 'પિનકોડ અથવા શહેર શોધો' : 'पिनकोड या शहर ढूंढें'}
                                    </label>
                                    <AddressAutocomplete />
                                </div>

                                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#6B7280', marginBottom: '12px' }}>
                                        {language === 'gu' ? 'મુખ્ય જિલ્લાઓ' : 'प्रमुख जिले'}
                                    </label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {GUJARAT_DISTRICTS.slice(0, 15).map(dist => (
                                            <button
                                                key={dist.district_en}
                                                onClick={() => {
                                                    setUserLocation({
                                                        lat: 0, lng: 0,
                                                        city: dist.district_en,
                                                        address: `${dist.district_en}, Gujarat, India`,
                                                        district: dist.district_en,
                                                        pincode: '', state: 'Gujarat'
                                                    });
                                                    setIsOpen(false);
                                                }}
                                                style={{
                                                    padding: '8px 16px', borderRadius: '12px', border: '1px solid #E5E7EB',
                                                    fontSize: '13px', fontWeight: 700, color: '#374151', background: 'white'
                                                }}
                                            >
                                                {dist.district_gu}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#2D5016', color: 'white', fontWeight: 900, marginTop: '12px' }}
                                >
                                    {language === 'gu' ? 'બંધ કરો' : 'बंद करें'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
