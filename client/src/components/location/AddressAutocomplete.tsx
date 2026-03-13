'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddressAutocomplete() {
    const { setUserLocation } = useLocation();
    const { language, t } = useLanguage();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const gujaratPincodeMap: Record<string, { city: string, district: string }> = {
        "380001": { city: "Ahmedabad", district: "Ahmedabad" },
        "380015": { city: "Ahmedabad (Satellite)", district: "Ahmedabad" },
        "388001": { city: "Anand", district: "Anand" },
        "388120": { city: "Vidyanagar", district: "Anand" },
        "390001": { city: "Vadodara", district: "Vadodara" },
        "395001": { city: "Surat", district: "Surat" },
        "360001": { city: "Rajkot", district: "Rajkot" },
        "364001": { city: "Bhavnagar", district: "Bhavnagar" },
        "382010": { city: "Gandhinagar", district: "Gandhinagar" },
        "370001": { city: "Bhuj", district: "Kutch" }
    };

    const checkPincode = (val: string) => {
        if (/^[3][6-9][0-9]{4}$/.test(val)) {
            const match = gujaratPincodeMap[val];
            if (match) {
                setUserLocation({
                    lat: 0, lng: 0, // Should ideally be updated but for fallback we fill text
                    address: `${match.city}, ${match.district}, Gujarat, India`,
                    city: match.city,
                    district: match.district,
                    pincode: val,
                    state: "Gujarat"
                });
                setQuery(val);
                setIsOpen(false);
                setResults([]);
                return true;
            }
        }
        return false;
    };

    const handleSearch = async (val: string) => {
        setQuery(val);
        if (checkPincode(val)) return;

        if (val.length < 3) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsSearching(true);
        try {
            // Gujarat Bounding Box: [minLat, minLon, maxLat, maxLon]
            // approx: 20.1, 68.1, 24.7, 74.5
            const viewbox = '68.1,20.1,74.5,24.7';
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&viewbox=${viewbox}&bounded=1&addressdetails=1&limit=5`,
                { headers: { 'Accept-Language': language } }
            );
            const data = await response.json();
            setResults(data);
            setIsOpen(true);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (query.length >= 3) {
            timeoutRef.current = setTimeout(() => {
                handleSearch(query);
            }, 500);
        } else {
            setResults([]);
            setIsOpen(false);
        }
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [query]);

    const handleSelect = (item: any) => {
        const addr = item.address;
        const city = addr.city || addr.town || addr.village || addr.suburb;
        const district = addr.county || addr.state_district;

        setUserLocation({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            address: item.display_name,
            city,
            district,
            pincode: addr.postcode,
            state: addr.state
        });
        setQuery(item.display_name);
        setIsOpen(false);
        setResults([]);
    };

    return (
        <div className="relative w-full">
            <div className="relative flex items-center">
                <span className="absolute left-4 text-zinc-400">🔍</span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 3 && results.length > 0 && setIsOpen(true)}
                    placeholder={language === 'gu' ? 'તમારા વિસ્તારનું નામ લખો...' : 'अपने क्षेत्र का नाम लिखें...'}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:border-green-500 dark:focus:border-green-500/50 outline-none transition-all font-medium text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                />
                {isSearching && (
                    <div className="absolute right-4 w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                )}
            </div>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-2xl z-[100] overflow-hidden"
                    >
                        {results.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelect(item)}
                                className="w-full p-4 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left border-b border-zinc-50 dark:border-zinc-800 last:border-0"
                            >
                                <div className="mt-1 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg flex-shrink-0">
                                    {item.type === 'house' ? '🏠' : item.type === 'commercial' ? '🏢' : '📍'}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                        {item.display_name.split(',')[0]}
                                    </div>
                                    <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 line-clamp-2">
                                        {item.display_name.split(',').slice(1).join(',')}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
