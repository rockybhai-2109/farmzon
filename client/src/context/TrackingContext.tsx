'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Location {
    lat: number;
    lng: number;
    name: string;
}

export type DeliveryStatus = 'loaded' | 'in_transit' | 'near_you' | 'delivered';

export interface ActiveTrip {
    id: number;
    orderId: string;
    driverName: string;
    driverPhone: string;
    status: DeliveryStatus;
    currentLocation: Location;
    destinationName: string;
    eta: string;
    progress: number; // 0 to 100
}

interface TrackingContextType {
    activeTrips: ActiveTrip[];
    startTracking: (orderId: string, driverName: string, driverPhone: string, fromCoords: Location, destinationName: string) => void;
    updateTripStatus: (orderId: string, status: DeliveryStatus, progress: number) => void;
    stopTracking: (orderId: string) => void;
    getTripByOrderId: (orderId: string) => ActiveTrip | undefined;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

const STORAGE_KEY = 'kisanmart_active_tracking';

export function TrackingProvider({ children }: { children: React.ReactNode }) {
    const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setActiveTrips(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTrips));
    }, [activeTrips]);

    // Simulated movement for demo purposes
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTrips(prev => prev.map(trip => {
                if (trip.status === 'in_transit' && trip.progress < 90) {
                    const newProgress = Math.min(90, trip.progress + 0.5);
                    return { ...trip, progress: newProgress };
                }
                return trip;
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const startTracking = useCallback((orderId: string, driverName: string, driverPhone: string, fromCoords: Location, destinationName: string) => {
        const newTrip: ActiveTrip = {
            id: Date.now(),
            orderId,
            driverName,
            driverPhone,
            status: 'loaded',
            currentLocation: fromCoords,
            destinationName,
            eta: '45 mins',
            progress: 5
        };
        setActiveTrips(prev => [...prev.filter(t => t.orderId !== orderId), newTrip]);
    }, []);

    const updateTripStatus = useCallback((orderId: string, status: DeliveryStatus, progress: number) => {
        setActiveTrips(prev => prev.map(t => t.orderId === orderId ? { ...t, status, progress } : t));
    }, []);

    const stopTracking = useCallback((orderId: string) => {
        setActiveTrips(prev => prev.filter(t => t.orderId !== orderId));
    }, []);

    const getTripByOrderId = useCallback((orderId: string) => {
        return activeTrips.find(t => t.orderId === orderId);
    }, [activeTrips]);

    return (
        <TrackingContext.Provider value={{ activeTrips, startTracking, updateTripStatus, stopTracking, getTripByOrderId }}>
            {children}
        </TrackingContext.Provider>
    );
}

export const useTracking = () => {
    const context = useContext(TrackingContext);
    if (!context) throw new Error('useTracking must be used within TrackingProvider');
    return context;
};
