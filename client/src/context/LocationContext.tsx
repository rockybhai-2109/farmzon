'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationData {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    district?: string;
    pincode?: string;
    state?: string;
}

interface LocationContextType {
    userLocation: LocationData | null;
    setUserLocation: (loc: LocationData | null) => void;
    recentLocations: LocationData[];
    addRecentLocation: (loc: LocationData) => void;
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
    reverseGeocode: (lat: number, lng: number, lang: string) => Promise<LocationData | null>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [userLocation, setUserLocationState] = useState<LocationData | null>(null);
    const [recentLocations, setRecentLocations] = useState<LocationData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedLocation = localStorage.getItem('kisanmart_user_location');
        if (savedLocation) {
            try {
                setUserLocationState(JSON.parse(savedLocation));
            } catch (e) {
                console.error('Failed to parse saved location', e);
            }
        }

        const savedRecent = localStorage.getItem('kisanmart_recent_locations');
        if (savedRecent) {
            try {
                setRecentLocations(JSON.parse(savedRecent));
            } catch (e) {
                console.error('Failed to parse recent locations', e);
            }
        }
    }, []);

    const setUserLocation = (loc: LocationData | null) => {
        setUserLocationState(loc);
        if (loc) {
            localStorage.setItem('kisanmart_user_location', JSON.stringify(loc));
            addRecentLocation(loc);
        } else {
            localStorage.removeItem('kisanmart_user_location');
        }
    };

    const addRecentLocation = (loc: LocationData) => {
        setRecentLocations(prev => {
            const filtered = prev.filter(p => p.address !== loc.address);
            const updated = [loc, ...filtered].slice(0, 3);
            localStorage.setItem('kisanmart_recent_locations', JSON.stringify(updated));
            return updated;
        });
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const reverseGeocode = async (lat: number, lng: number, lang: string): Promise<LocationData | null> => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                { headers: { 'Accept-Language': lang } }
            );
            const data = await response.json();

            const addr = data.address;
            const fullAddress = data.display_name;
            const city = addr.city || addr.town || addr.village || addr.suburb;
            const district = addr.county || addr.state_district;
            const pincode = addr.postcode;

            const loc: LocationData = {
                lat, lng,
                address: fullAddress,
                city, district, pincode,
                state: addr.state
            };
            setUserLocation(loc);
            return loc;
        } catch (error) {
            console.error('Reverse geocode failed', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LocationContext.Provider value={{
            userLocation,
            setUserLocation,
            recentLocations,
            addRecentLocation,
            calculateDistance,
            isLoading,
            setIsLoading,
            reverseGeocode
        }}>
            {children}
        </LocationContext.Provider>
    );
}

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
