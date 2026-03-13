'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Listing {
    id: number;
    image: string;
    name: string;
    variety?: string;
    description?: string;
    perks?: string[];
    farmer: string;
    farmerEn: string;
    location: string;
    price: number;
    qty: number;
    minOrder: number;
    freshness: number;
    trend: string;
    organic: boolean;
    farmerId: number;
    category: string;
    lat: number;
    lng: number;
}

interface InventoryContextType {
    listings: Listing[];
    addListing: (listing: Omit<Listing, 'id'>) => void;
    updateListing: (id: number, updates: Partial<Listing>) => void;
    deleteListing: (id: number) => void;
    getFarmerListings: (farmerId: number) => Listing[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEY = 'kisanmart_inventory';

const INITIAL_LISTINGS: Listing[] = [
    {
        id: 1, image: '/images/vegetables/tomato.jpg', name: 'Tomatoes',
        variety: 'F1 Hybrid (Himsona)',
        description: 'Firm and juicy tomatoes, perfect for long-distance transport. Grown using zero-residue organic methods.',
        perks: ['Zero Residue', 'Hand-picked', 'Uniform Size'],
        farmer: 'રાજેશ પટેલ', farmerEn: 'Rajesh Patel', location: 'Anand, Gujarat', price: 28, qty: 800, minOrder: 50, freshness: 95, trend: '📈', organic: true, farmerId: 1, category: 'Fruiting Vegetables', lat: 22.5615, lng: 72.9535
    },
    {
        id: 2, image: '/images/vegetables/lady-finger.jpg', name: 'Lady Finger',
        variety: 'Mahyco (Bhendi No. 10)',
        description: 'Tender and dark green lady fingers. Harvesting strictly at 3-4 inches for maximum tenderness.',
        perks: ['Tender Quality', 'Daily Harvest', 'No Spray'],
        farmer: 'રાજેશ પટેલ', farmerEn: 'Rajesh Patel', location: 'Anand, Gujarat', price: 35, qty: 400, minOrder: 30, freshness: 100, trend: '➡️', organic: true, farmerId: 1, category: 'Fruiting Vegetables', lat: 22.5615, lng: 72.9535
    },
    {
        id: 3, image: '/images/vegetables/brinjal.jpg', name: 'Brinjal',
        variety: 'Ravaiya (Small Green)',
        description: 'Traditional Gujarati small brinjals. Perfect for stuffing. High gloss and no seeds.',
        perks: ['Seedless', 'Glossy Finish', 'Local Variety'],
        farmer: 'રાજેશ પટેલ', farmerEn: 'Rajesh Patel', location: 'Anand, Gujarat', price: 22, qty: 600, minOrder: 40, freshness: 90, trend: '📉', organic: true, farmerId: 1, category: 'Fruiting Vegetables', lat: 22.5615, lng: 72.9535
    },
    {
        id: 4, image: '/images/vegetables/onion.jpg', name: 'Onion',
        variety: 'Nasik Red',
        description: 'Well-cured red onions with triple-layer skin for excellent shelf life. Pungent and juicy.',
        perks: ['Well Cured', 'Triple Layer', 'Export Grade'],
        farmer: 'સુનીતા દેવી', farmerEn: 'Sunita Devi', location: 'Vadodara, Gujarat', price: 24, qty: 1200, minOrder: 100, freshness: 98, trend: '📈', organic: true, farmerId: 2, category: 'Bulb Vegetables', lat: 22.3072, lng: 73.1812
    },
    {
        id: 5, image: '/images/vegetables/potato.jpg', name: 'Potato',
        variety: 'LR (Lady Rosetta)',
        description: 'Best for chips making or household frying. Low sugar content and firm texture.',
        perks: ['Low Sugar', 'Firm Texture', 'Dry Earthy'],
        farmer: 'સુનીતા દેવી', farmerEn: 'Sunita Devi', location: 'Vadodara, Gujarat', price: 18, qty: 2000, minOrder: 150, freshness: 96, trend: '➡️', organic: true, farmerId: 2, category: 'Tuber Vegetables', lat: 22.3072, lng: 73.1812
    },
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
    const [listings, setListings] = useState<Listing[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setListings(JSON.parse(saved));
            } else {
                setListings(INITIAL_LISTINGS);
            }
        } catch (e) {
            setListings(INITIAL_LISTINGS);
        }
    }, []);

    useEffect(() => {
        if (listings.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
        }
    }, [listings]);

    const addListing = useCallback((listing: Omit<Listing, 'id'>) => {
        setListings(prev => [...prev, { ...listing, id: Date.now() }]);
    }, []);

    const updateListing = useCallback((id: number, updates: Partial<Listing>) => {
        setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    }, []);

    const deleteListing = useCallback((id: number) => {
        setListings(prev => prev.filter(l => l.id !== id));
    }, []);

    const getFarmerListings = useCallback((farmerId: number) => {
        return listings.filter(l => l.farmerId === farmerId);
    }, [listings]);

    return (
        <InventoryContext.Provider value={{ listings, addListing, updateListing, deleteListing, getFarmerListings }}>
            {children}
        </InventoryContext.Provider>
    );
}

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) throw new Error('useInventory must be used within InventoryProvider');
    return context;
};
