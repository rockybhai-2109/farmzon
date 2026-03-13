'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import 'leaflet/dist/leaflet.css';

const TrackingMap = dynamic(
    () => import('react-leaflet').then((mod) => {
        const { MapContainer, TileLayer, Marker, Polyline, Popup } = mod;

        return function Map({ start, end, progress }: any) {
            const currentPos: [number, number] = [
                start[0] + (end[0] - start[0]) * progress,
                start[1] + (end[1] - start[1]) * progress
            ];

            return (
                <MapContainer
                    center={currentPos}
                    zoom={12}
                    className="w-full h-full"
                    zoomControl={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={start}><Popup>Farmer Location</Popup></Marker>
                    <Marker position={end}><Popup>Your Location</Popup></Marker>
                    <Marker position={currentPos} icon={new (require('leaflet').Icon)({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/75/75702.png',
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    })} />
                    <Polyline positions={[start, end]} color="#16A34A" dashArray="10, 10" />
                </MapContainer>
            );
        }
    }),
    { ssr: false }
);

export default function LiveTrackingMap({ order }: { order: any }) {
    const { language, t } = useLanguage();
    const [progress, setProgress] = useState(0.4); // Mock progress 40%
    const farmerPos: [number, number] = [22.56, 72.95]; // Anand
    const buyerPos: [number, number] = [23.02, 72.57]; // Ahmedabad

    const milestones = [
        { id: 1, label: language === 'gu' ? 'ઓર્ડર મળ્યો' : 'ऑर्डर प्राप्त हुआ', time: '10:30 AM', completed: true },
        { id: 2, label: language === 'gu' ? 'શાકભાજી કટાઈ ગયા' : 'सब्जियां काटी गईं', time: '11:45 AM', completed: true },
        { id: 3, label: language === 'gu' ? 'ટ્રક રસ્તામાં છે' : 'ट्रक रास्ते में है', time: 'In Transit', active: true },
        { id: 4, label: language === 'gu' ? 'પહોંચી જશે' : 'पहुंच जाएगा', time: '02:00 PM', completed: false },
    ];

    return (
        <div className="flex flex-col h-[500px] bg-white dark:bg-zinc-950 rounded-[32px] overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800">
            {/* Map Header */}
            <div className="p-6 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
                <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white font-display">
                        {language === 'gu' ? 'લાઇવ ડિલિવરી ટ્રેકિંગ' : 'लाइव डिलीवरी ट्रैकिंग'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            TRUCK ID: KM-882
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">Estimated Arrival</div>
                    <div className="text-lg font-black text-green-600">45 Mins</div>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Map Area */}
                <div className="flex-1 relative">
                    <TrackingMap start={farmerPos} end={buyerPos} progress={progress} />
                </div>

                {/* Milestones Sidebar */}
                <div className="w-full md:w-80 p-6 bg-zinc-50 dark:bg-zinc-900/50 border-l border-zinc-100 dark:border-zinc-800 overflow-y-auto">
                    <div className="space-y-8 relative">
                        {/* Timeline Path */}
                        <div className="absolute left-[15px] top-2 bottom-6 w-1 bg-zinc-200 dark:bg-zinc-800" />

                        {milestones.map((m) => (
                            <div key={m.id} className="relative flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${m.completed ? 'bg-green-600 text-white' :
                                        m.active ? 'bg-amber-500 text-white animate-pulse' :
                                            'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                                    }`}>
                                    {m.completed ? '✓' : m.id}
                                </div>
                                <div className="flex-1">
                                    <div className={`text-sm font-black ${m.completed || m.active ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                                        {m.label}
                                    </div>
                                    <div className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-tighter">
                                        {m.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Driver Card */}
                    <div className="mt-8 p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center text-xl">🚚</div>
                        <div>
                            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Driver</div>
                            <div className="text-sm font-bold text-zinc-800 dark:text-zinc-100">વિકાસભાઈ (Vikas)</div>
                        </div>
                        <button className="ml-auto w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">📞</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
