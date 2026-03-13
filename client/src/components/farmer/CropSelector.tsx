'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, Sprout } from 'lucide-react';
import { VEGETABLE_NAMES } from '@/data/gujaratData';

interface CropSelectorProps {
    selectedCrops: string;
    onChange: (crops: string) => void;
    language: 'gu' | 'en' | 'hi';
}

export default function CropSelector({ selectedCrops, onChange, language }: CropSelectorProps) {
    const [search, setSearch] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const selectedList = useMemo(() => {
        return selectedCrops ? selectedCrops.split(',').map(c => c.trim()).filter(Boolean) : [];
    }, [selectedCrops]);

    const allCrops = useMemo(() => {
        return Object.entries(VEGETABLE_NAMES).map(([en, data]) => ({
            en,
            label: language === 'gu' ? data.gu : (language === 'hi' ? data.hi : en),
            emoji: data.emoji
        }));
    }, [language]);

    const filteredCrops = useMemo(() => {
        if (!search) return allCrops.slice(0, 8); // Show popular/first 8
        return allCrops.filter(crop =>
            crop.label.toLowerCase().includes(search.toLowerCase()) ||
            crop.en.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, allCrops]);

    const toggleCrop = (cropLabel: string) => {
        let newList;
        if (selectedList.includes(cropLabel)) {
            newList = selectedList.filter(c => c !== cropLabel);
        } else {
            newList = [...selectedList, cropLabel];
        }
        onChange(newList.join(', '));
    };

    return (
        <div className="space-y-4">
            {/* Search and Input Area */}
            <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
                <div className={`
                    bg-gray-50 border-2 rounded-2xl p-2 flex flex-wrap gap-2 transition-all 
                    ${isFocused ? 'border-green-500 bg-white shadow-xl shadow-green-50' : 'border-transparent'}
                `}>
                    <AnimatePresence>
                        {selectedList.map(crop => (
                            <motion.span
                                key={crop}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 border border-green-200"
                            >
                                {allCrops.find(c => c.label === crop)?.emoji} {crop}
                                <button
                                    type="button"
                                    onClick={() => toggleCrop(crop)}
                                    className="hover:text-green-900 bg-white/50 rounded-full p-0.5"
                                >
                                    <X size={12} />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>

                    <div className="flex-1 min-w-[150px] flex items-center gap-3 px-3 py-2">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder={selectedList.length > 0 ? "" : "Search crops (e.g. Tomato, Potato)..."}
                            className="bg-transparent border-0 focus:ring-0 w-full text-sm font-bold text-gray-800 p-0"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        />
                    </div>
                </div>

                {/* Dropdown Results */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] p-4 max-h-[300px] overflow-y-auto custom-scrollbar"
                        >
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
                                {search ? 'Search Results' : 'Suggested Crops'}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {filteredCrops.map(crop => {
                                    const isSelected = selectedList.includes(crop.label);
                                    return (
                                        <motion.button
                                            key={crop.en}
                                            type="button"
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleCrop(crop.label)}
                                            className={`
                                                flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all text-left relative overflow-hidden group
                                                ${isSelected
                                                    ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                                                    : 'bg-gray-50 text-gray-700 border border-transparent hover:border-green-200 hover:bg-white'}
                                            `}
                                        >
                                            <span className="text-xl group-hover:scale-110 transition-transform">{crop.emoji}</span>
                                            <span className="flex-1">{crop.label}</span>
                                            <div className={`
                                                w-5 h-5 rounded-full flex items-center justify-center transition-all border-2
                                                ${isSelected
                                                    ? 'bg-white border-white'
                                                    : 'border-gray-200 bg-white/50 group-hover:border-green-300'}
                                            `}>
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0, rotate: -45 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            exit={{ scale: 0, rotate: -45 }}
                                                        >
                                                            <Check size={12} className="text-green-600 font-black" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                            {filteredCrops.length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    <Sprout size={32} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-xs font-bold">No crops found</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!isFocused && !search && selectedList.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {allCrops.slice(0, 5).map(crop => (
                        <button
                            key={crop.en}
                            type="button"
                            onClick={() => toggleCrop(crop.label)}
                            className="bg-white border-2 border-gray-100 hover:border-green-200 hover:bg-green-50 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tight text-gray-500 transition-all flex items-center gap-2"
                        >
                            {crop.emoji} {crop.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
