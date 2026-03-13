'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, LocateFixed, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for Leaflet default icon issues in Next.js
const LeafletMap = dynamic(
    () => import('react-leaflet').then((mod) => {
        const { MapContainer, TileLayer, Marker, useMapEvents } = mod;
        const L = require('leaflet');

        const greenIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        const LocationMarker = () => {
            const { userLocation, reverseGeocode } = useLocation();
            const { language } = useLanguage();

            const eventHandlers = React.useMemo(
                () => ({
                    dragend(e: any) {
                        const marker = e.target;
                        if (marker != null) {
                            const latLng = marker.getLatLng();
                            reverseGeocode(latLng.lat, latLng.lng, language);
                        }
                    },
                }),
                [language, reverseGeocode]
            );

            useMapEvents({
                click(e) {
                    reverseGeocode(e.latlng.lat, e.latlng.lng, language);
                },
            });

            return userLocation ? (
                <Marker
                    draggable={true}
                    eventHandlers={eventHandlers}
                    position={[userLocation.lat, userLocation.lng]}
                    icon={greenIcon}
                />
            ) : null;
        };

        const MapWatcher = ({ center }: { center: [number, number] }) => {
            const map = useMapEvents({});
            useEffect(() => {
                map.setView(center, map.getZoom());
            }, [center, map]);
            return null;
        };

        return function MapComponent({ center }: { center: [number, number] }) {
            return (
                <MapContainer
                    center={center}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                    <MapWatcher center={center} />
                </MapContainer>
            );
        };
    }),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-zinc-100 animate-pulse flex items-center justify-center">
                <span className="text-zinc-400 font-bold text-xs px-4 text-center">📍 નકશો લોડ થઈ રહ્યો છે...</span>
            </div>
        )
    }
);

export default function MiniMap() {
    const { userLocation, reverseGeocode, isLoading } = useLocation();
    const { language } = useLanguage();
    const defaultCenter: [number, number] = [23.0225, 72.5714]; // Ahmedabad
    const [center, setCenter] = useState<[number, number]>(defaultCenter);

    useEffect(() => {
        if (userLocation) {
            setCenter([userLocation.lat, userLocation.lng]);
        }
    }, [userLocation]);

    // Initialize Leaflet Icons (workaround for Next.js)
    useEffect(() => {
        const L = require('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);

    const handleLocateMe = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => reverseGeocode(pos.coords.latitude, pos.coords.longitude, language),
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );
    };

    return (
        <div style={{ height: '220px' }} className="w-full rounded-2xl overflow-hidden border-2 border-zinc-100 shadow-inner group relative">
            <LeafletMap center={center} />

            <div className="absolute top-3 right-3 z-[400]">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLocateMe}
                    disabled={isLoading}
                    title="Find My Location"
                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200 flex items-center justify-center text-primary hover:bg-white transition-colors cursor-pointer"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <LocateFixed className="w-5 h-5" />
                    )}
                </motion.button>
            </div>

            <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-[10px] font-bold text-[#2D5016] border border-[#2D5016]/20 shadow-lg flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{language === 'gu' ? 'પિનને ડ્રેગ કરીને લોકેશન સેટ કરો' : 'पिन को ड्रैग करके लोकेशन सेट करें'}</span>
            </div>
        </div>
    );
}
