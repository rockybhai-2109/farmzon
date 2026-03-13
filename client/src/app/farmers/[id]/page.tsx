'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ImpactBadges } from '@/components/farmer/ImpactBadges';
import { AIStory } from '@/components/farmer/AIStory';
import { Star, MapPin, ShieldCheck, Clock, Award, Leaf, ArrowRight, Share2, Heart, Plus, Minus, Check, ShoppingCart, Package, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { VEGETABLE_NAMES } from '@/data/gujaratData';
import OrderFlow from '@/components/OrderFlow';

const farmersData: Record<string, {
    id: number; image: string; name: string; farm: string; location: string;
    rating: number; reviews: number; badge: string; badgeClass: string;
    phone: string; totalSold: string; joined: string; story: string; crops: string[];
    listings: { id: number; image: string; name: string; variety?: string; description?: string; perks?: string[]; price: number; qty: number; minOrder: number; freshness: number; harvestLabel: string }[];
    reviews_list: { buyer: string; rating: number; text: string; date: string; type: string }[];
    calendar: { emoji: string; crop: string; date: string; qty: string; status: string }[];
}> = {
    '1': {
        id: 1, image: '/images/farmers/rajesh.jpg', name: 'Rajesh Patel', farm: 'Green Earth Farm',
        location: 'Anand, Gujarat', rating: 4.8, reviews: 124,
        badge: '🏆 Top Seller', badgeClass: 'km-badge-gold',
        phone: '+91 98765 43210', totalSold: '48,000 kg', joined: 'Jan 2022', story: 'Third-generation organic farmer with 12 acres of certified land. Supplying restaurants and grocery chains since 2018. My family has been farming this land for over 60 years, and we are deeply committed to organic practices that respect both the land and the people who eat from it.',
        crops: ['🍅 Tomatoes', '🍆 Brinjal', '🫑 Okra', '🥬 Spinach'],
        listings: [
            {
                id: 101,
                image: '/images/vegetables/tomato.jpg', name: 'Organic Tomatoes',
                variety: 'F1 Hybrid (Himsona)',
                description: 'Firm and juicy tomatoes, perfect for long-distance transport. Grown using zero-residue organic methods.',
                perks: ['Zero Residue', 'Hand-picked', 'Uniform Size'],
                price: 28, qty: 800, minOrder: 50, freshness: 95, harvestLabel: 'Harvested 2 days ago'
            },
            {
                id: 102,
                image: '/images/vegetables/lady-finger.jpg', name: 'Lady Finger',
                variety: 'Mahyco (Bhendi No. 10)',
                description: 'Tender and dark green lady fingers. Harvesting strictly at 3-4 inches for maximum tenderness.',
                perks: ['Tender Quality', 'Daily Harvest', 'No Spray'],
                price: 35, qty: 400, minOrder: 30, freshness: 100, harvestLabel: 'Harvested Today'
            },
            {
                id: 103,
                image: '/images/vegetables/brinjal.jpg', name: 'Brinjal',
                variety: 'Ravaiya (Small Green)',
                description: 'Traditional Gujarati small brinjals. Perfect for stuffing. High gloss and no seeds.',
                perks: ['Seedless', 'Glossy Finish', 'Local Variety'],
                price: 22, qty: 600, minOrder: 40, freshness: 90, harvestLabel: 'Harvested Yesterday'
            },
        ],
        reviews_list: [
            { buyer: 'Fresh Mart Store', rating: 5, text: 'Excellent quality tomatoes. Very fresh and consistent supply. Will definitely order again!', date: '2 days ago', type: 'Vegetable Shop' },
            { buyer: 'Hotel Raj Palace', rating: 5, text: 'Rajesh bhai supplies us regularly. Farm fresh quality, never disappoints.', date: '1 week ago', type: 'Restaurant' },
            { buyer: 'City Distributor', rating: 4, text: 'Good produce but delivery needs to be a bit faster. Overall satisfied.', date: '2 weeks ago', type: 'Distributor' },
            { buyer: 'Swad Restaurant', rating: 5, text: 'Best organic tomatoes in Gujarat! Our customers love them.', date: '1 month ago', type: 'Restaurant' },
            { buyer: 'Green Grocery', rating: 5, text: 'Very honest farmer. What he commits, he delivers. Highly recommend.', date: '6 weeks ago', type: 'Vegetable Shop' },
        ],
        calendar: [
            { emoji: '🍅', crop: 'Tomatoes', date: 'Tomorrow', qty: '500 kg', status: 'Harvesting Now' },
            { emoji: '🫑', crop: 'Okra', date: 'In 3 Days', qty: '300 kg', status: 'Ready' },
            { emoji: '🍆', crop: 'Brinjal', date: 'Next Week', qty: '800 kg', status: 'Pre-book' },
            { emoji: '🥬', crop: 'Spinach', date: 'In 10 Days', qty: '200 kg', status: 'Pre-book' },
        ],
    },
    '2': {
        id: 2, image: '/images/farmers/sunita.jpg', name: 'Sunita Devi', farm: 'Sunrise Organic Farm',
        location: 'Vadodara, Gujarat', rating: 4.6, reviews: 89,
        badge: '🌿 Certified Organic', badgeClass: 'km-badge-green',
        phone: '+91 98765 43211', totalSold: '31,000 kg', joined: 'Mar 2023', story: 'Pioneering woman farmer using natural pest control on 8 acres. Zero chemicals, zero pesticides. I believe that what\'s good for the soil is good for all of us. My farm practices biodynamic agriculture.',
        crops: ['🥬 Spinach', '🌿 Coriander', '🥦 Cabbage'],
        listings: [
            {
                id: 201,
                image: '/images/vegetables/spinach.jpg', name: 'Fresh Spinach',
                variety: 'Local Broad-leaf',
                description: 'Lush green spinach leaves, harvested in the early morning to retain moisture and nutrients.',
                perks: ['Iron Rich', 'No Pesticides', 'Morning Fresh'],
                price: 18, qty: 300, minOrder: 20, freshness: 100, harvestLabel: 'Harvested Today'
            },
            {
                id: 202,
                image: '/images/vegetables/coriander.jpg', name: 'Coriander',
                variety: 'Desi Sugandhit',
                description: 'Highly aromatic local coriander variety. Grown with pure well water.',
                perks: ['High Aroma', 'Pure Water', 'Green Stem'],
                price: 45, qty: 150, minOrder: 10, freshness: 100, harvestLabel: 'Harvested Today'
            },
            {
                id: 203,
                image: '/images/vegetables/cabbage.jpg', name: 'Cabbage',
                variety: 'F1 Hybrid (Green Express)',
                description: 'Compact and heavy heads. Very crisp and sweet in taste.',
                perks: ['Crisp heads', 'Sweet Taste', 'Uniform Shape'],
                price: 15, qty: 1000, minOrder: 50, freshness: 92, harvestLabel: 'Harvested Yesterday'
            },
        ],
        reviews_list: [
            { buyer: 'Satvik Restaurant', rating: 5, text: 'The spinach is absolutely fresh! Perfect for our daily kitchen needs.', date: '3 days ago', type: 'Restaurant' },
            { buyer: 'Health Mart', rating: 5, text: 'Sunita didi is very professional. Coriander always freshly cut.', date: '2 weeks ago', type: 'Vegetable Shop' },
            { buyer: 'Meals On Wheels', rating: 4, text: 'Reliable supply. Could do with better packaging.', date: '1 month ago', type: 'Distributor' },
        ],
        calendar: [
            { emoji: '🥬', crop: 'Spinach', date: 'Today', qty: '300 kg', status: 'Harvesting Now' },
            { emoji: '🌿', crop: 'Coriander', date: 'In 2 Days', qty: '150 kg', status: 'Ready' },
            { emoji: '🥦', crop: 'Cabbage', date: 'Next Week', qty: '1000 kg', status: 'Pre-book' },
        ],
    },
    '3': {
        id: 3, image: '/images/farmers/vijay.jpg', name: 'Vijay Kumar', farm: 'Valley Fresh Farm',
        location: 'Mehsana, Gujarat', rating: 4.9, reviews: 201,
        badge: '⭐ Premium Farmer', badgeClass: 'km-badge-purple',
        phone: '+91 98765 43212', totalSold: '92,000 kg', joined: 'Jun 2021', story: 'Export-quality vegetables since 2018. Supplying 40+ restaurants and hotel chains across Gujarat. Started with just 2 acres, now managing a 15-acre fully certified organic operation with 5 full-time farm workers.',
        crops: ['🫑 Capsicum', '🥒 Cucumber', '🥬 Bitter Gourd'],
        listings: [
            {
                id: 301,
                image: '/images/vegetables/capsicum.jpg', name: 'Capsicum Mixed',
                variety: 'Indra (Green & Yellow)',
                description: 'Export-grade bell peppers. Thick-walled and perfectly shaped for premium kitchen use.',
                perks: ['Thick Walled', 'Export Grade', 'Vibrant Color'],
                price: 55, qty: 500, minOrder: 25, freshness: 100, harvestLabel: 'Harvested Today'
            },
            {
                id: 302,
                image: '/images/vegetables/cucumber.jpg', name: 'Cucumber',
                variety: 'English Long Greenhouse',
                description: 'Seedless greenhouse cucumbers. Very refreshing and crisp.',
                perks: ['Seedless', 'Crisp Snap', 'Greenhouse Grown'],
                price: 20, qty: 800, minOrder: 50, freshness: 88, harvestLabel: 'Harvested 2 days ago'
            },
            {
                id: 303,
                image: '/images/vegetables/bitter-gourd.jpg', name: 'Bitter Gourd',
                variety: 'Pragati (Dark Green)',
                description: 'Firm and bitter, just as it should be. High medicinal value and fresh quality.',
                perks: ['Medicinal Value', 'Firm Texture', 'Deep Green'],
                price: 40, qty: 250, minOrder: 20, freshness: 94, harvestLabel: 'Harvested Yesterday'
            },
        ],
        reviews_list: [
            { buyer: 'Taj Hotel Group', rating: 5, text: 'We source all our capsicum from Vijay bhai. Impeccable quality.', date: '1 day ago', type: 'Hotel' },
            { buyer: 'BigBazaar Surat', rating: 5, text: 'Most consistent farmer on the platform. 201 orders and never a miss.', date: '1 week ago', type: 'Distributor' },
            { buyer: 'Spice Route Restaurant', rating: 5, text: 'Fresh, beautiful cucumbers. Our salad sales went up 30%!', date: '10 days ago', type: 'Restaurant' },
            { buyer: 'Metro Cash & Carry', rating: 5, text: 'Professional service and export-quality produce. Highly recommended.', date: '3 weeks ago', type: 'Distributor' },
            { buyer: 'Noodle House', rating: 4, text: 'Great bitter gourd batch. A bit small in size, but fresh and tasty.', date: '1 month ago', type: 'Restaurant' },
        ],
        calendar: [
            { emoji: '🫑', crop: 'Capsicum', date: 'Today', qty: '500 kg', status: 'Harvesting Now' },
            { emoji: '🥒', crop: 'Cucumber', date: 'In 4 Days', qty: '600 kg', status: 'Ready' },
            { emoji: '🥬', crop: 'Bitter Gourd', date: 'In 2 Weeks', qty: '400 kg', status: 'Pre-book' },
        ],
    },
};

function FreshnessBar({ percent }: { percent: number }) {
    const color = percent >= 90 ? '#7CB842' : percent >= 70 ? '#F4A837' : '#C85A2A';
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>Freshness</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color }}>{percent}%</span>
            </div>
            <div style={{ height: '5px', borderRadius: '3px', background: '#E5E7EB', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percent}%`, background: color, borderRadius: '3px' }} />
            </div>
        </div>
    );
}

function StarRating({ rating, large }: { rating: number; large?: boolean }) {
    const size = large ? '22px' : '14px';
    return (
        <span style={{ fontSize: size }}>
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ color: i <= Math.round(rating) ? '#F59E0B' : '#D1D5DB' }}>★</span>
            ))}
        </span>
    );
}

export default function FarmerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const [activeTab, setActiveTab] = useState(0);
    const [resolvedId, setResolvedId] = React.useState<string | null>(null);
    const { addToCart, isInCart } = useCart();

    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [showOrderFlow, setShowOrderFlow] = useState<number | null>(null);
    const [addedFlash, setAddedFlash] = useState<number | null>(null);

    React.useEffect(() => {
        params.then(p => setResolvedId(p.id));
    }, [params]);

    const farmer = resolvedId ? farmersData[resolvedId] : farmersData['1'];

    // Initialize quantities when farmer data is loaded
    React.useEffect(() => {
        if (farmer) {
            const initialQtys: Record<number, number> = {};
            farmer.listings.forEach(l => {
                initialQtys[l.id] = l.minOrder;
            });
            setQuantities(initialQtys);
        }
    }, [farmer]);

    if (!farmer) {
        return (
            <div>
                <Navigation />
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <div style={{ fontSize: '48px' }}>🌾</div>
                    <h2>Farmer not found</h2>
                    <Link href="/farmers" style={{ color: '#2D5016' }}>← Back to Farmers</Link>
                </div>
            </div>
        );
    }

    const handleQtyChange = (id: number, delta: number, minOrder: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(minOrder, (prev[id] || minOrder) + delta)
        }));
    };

    const handleAddToCart = (listing: any) => {
        const qty = quantities[listing.id] || listing.minOrder;
        const cropKey = Object.keys(VEGETABLE_NAMES).find(
            k => k.toLowerCase() === listing.name.toLowerCase()
        ) || listing.name;
        const emoji = (VEGETABLE_NAMES as any)[cropKey]?.emoji || '🥦';

        addToCart({
            id: listing.id,
            name: listing.name,
            localizedName: listing.name,
            emoji,
            farmer: farmer.name,
            farmerId: farmer.id,
            farmerPhone: farmer.phone.replace(/\s+/g, ''),
            location: farmer.location,
            price: listing.price,
            qty,
            minOrder: listing.minOrder,
            organic: true,
        });

        setAddedFlash(listing.id);
        setTimeout(() => setAddedFlash(null), 1000);
    };

    const tabs = ['🥦 Listings', '📖 Farm Story', '⭐ Reviews', '📅 Harvest Calendar'];

    const statusColor: Record<string, string> = {
        'Harvesting Now': '#166534',
        'Ready': '#92400E',
        'Pre-book': '#1E40AF',
    };
    const statusBg: Record<string, string> = {
        'Harvesting Now': '#DCFCE7',
        'Ready': '#FEF3C7',
        'Pre-book': '#DBEAFE',
    };

    return (
        <div className="bg-background min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <header className="relative pt-32 pb-24 px-5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B2B11] via-[#2D5016] to-[#4A7C28] -z-20" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-10" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />

                <div className="max-w-[1100px] mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <div className="w-48 h-48 rounded-[40px] glass overflow-hidden shadow-2xl relative z-10 border-white/20">
                                <img src={farmer.image} alt={farmer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-xl border-4 border-background z-20">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                        </motion.div>

                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex flex-wrap items-center gap-4 mb-4 justify-center md:justify-start">
                                    <h1 className="text-5xl font-black text-white font-display tracking-tight">{farmer.name}</h1>
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${farmer.badgeClass} shadow-lg border border-white/10`}>
                                        {farmer.badge}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm font-bold justify-center md:justify-start mb-8">
                                    <div className="flex items-center gap-2 text-white"><MapPin className="w-4 h-4 text-accent" /> {farmer.location}</div>
                                    <div className="flex items-center gap-2 text-white"><Award className="w-4 h-4 text-accent" /> Joined {farmer.joined}</div>
                                    <div className="flex items-center gap-2 md:hidden text-white"><Star className="w-4 h-4 text-yellow-400" /> {farmer.rating} ({farmer.reviews} reviews)</div>
                                </div>

                                <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-10">
                                    <ImpactBadges type="organic" />
                                    <ImpactBadges type="solar" />
                                    <ImpactBadges type="certified" />
                                </div>

                                <div className="flex flex-wrap gap-5 justify-center md:justify-start">
                                    <motion.a
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={`tel:${farmer.phone}`}
                                        className="relative group px-10 py-5 bg-gradient-to-r from-accent via-orange-500 to-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-[0_15px_40px_rgba(244,168,55,0.4)] flex items-center gap-3 no-underline transition-all overflow-hidden border border-white/20"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3)_0%,transparent_70%)]" />
                                        <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors relative z-10">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span className="relative z-10">Call Farmer</span>
                                    </motion.a>
                                    <motion.button
                                        whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-5 glass text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 border border-white/30 backdrop-blur-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all"
                                    >
                                        <ShieldCheck className="w-5 h-5 text-accent" />
                                        View Certifications
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Desktop Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="hidden lg:block w-72 glass-card p-8 border-white/10"
                        >
                            <div className="text-center space-y-8">
                                <div>
                                    <div className="text-4xl font-black text-white font-display">{farmer.rating}</div>
                                    <div className="flex justify-center my-2"><StarRating rating={farmer.rating} large /></div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50">{farmer.reviews} Total Reviews</div>
                                </div>
                                <div className="h-[1px] bg-white/10" />
                                <div>
                                    <div className="text-2xl font-black text-white font-display">{farmer.totalSold}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Total Sustainably Sold</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Premium Stats Bar Sub-Hero */}
            <div className="relative z-20 -mt-10 px-5">
                <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Leaf, label: 'Sustainable', val: '100%', color: 'from-green-500 to-emerald-700' },
                        { icon: ShieldCheck, label: 'Verified', val: 'Level 4', color: 'from-blue-500 to-indigo-700' },
                        { icon: CalendarIcon, label: 'Reliability', val: '98%', color: 'from-accent to-orange-700' },
                        { icon: Phone, label: 'Response', val: '< 2hrs', color: 'from-purple-500 to-pink-700' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.05) }}
                            className="glass-card p-5 border-none shadow-2xl flex items-center gap-4 bg-card"
                        >
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                                <div className="text-sm font-black text-foreground">{stat.val}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Sticky Tabs */}
            <div className="sticky top-16 bg-background/80 backdrop-blur-md border-b-2 border-border z-10 mt-12">
                <div className="max-w-[900px] mx-auto flex overflow-x-auto no-scrollbar">
                    {tabs.map((tab, i) => (
                        <button key={tab} onClick={() => setActiveTab(i)} className={`
                                px-6 py-6 font-black text-xs uppercase tracking-widest border-none cursor-pointer
                                whitespace-nowrap transition-all relative outline-none
                                ${activeTab === i ? 'text-primary' : 'text-muted-foreground opacity-60 hover:opacity-100'}
                            `}>
                            {tab}
                            {activeTab === i && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <main className="max-w-[900px] mx-auto px-5 py-12">
                <AnimatePresence mode="wait">

                    {/* Tab 1: Listings */}
                    {activeTab === 0 && (
                        <motion.div
                            key="listings"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-foreground font-display">Available Now</h2>
                                <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">
                                    {farmer.listings.length} Products
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {farmer.listings.map(l => {
                                    const qty = quantities[l.id] || l.minOrder;
                                    const inCart = isInCart(l.id);
                                    const cropKey = Object.keys(VEGETABLE_NAMES).find(
                                        k => k.toLowerCase() === l.name.toLowerCase()
                                    ) || l.name;
                                    const emoji = (VEGETABLE_NAMES as any)[cropKey]?.emoji || '🥦';

                                    return (
                                        <div key={l.id} className="km-card group border-none shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 bg-white dark:bg-zinc-900 rounded-[28px]">
                                            <div className="relative aspect-[16/10] overflow-hidden">
                                                <img src={l.image} alt={l.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                                                        {l.variety}
                                                    </span>
                                                </div>
                                                {inCart && (
                                                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg z-20">
                                                        ✓ In Cart
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            </div>

                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="text-xl font-black text-foreground mb-1 font-display">{l.name} {emoji}</h3>
                                                        <div className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                            {l.harvestLabel}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black text-primary font-display">₹{l.price}</div>
                                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">per kg</div>
                                                    </div>
                                                </div>

                                                <p className="text-muted-foreground text-xs leading-relaxed mb-5 opacity-80 line-clamp-2">
                                                    {l.description}
                                                </p>

                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                    {l.perks?.map(perk => (
                                                        <span key={perk} className="px-2.5 py-1 bg-muted/50 text-[9px] font-bold text-muted-foreground rounded-lg border border-border/40">
                                                            {perk}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="space-y-4 mb-6">
                                                    <FreshnessBar percent={l.freshness} />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="px-4 py-3 bg-muted/20 rounded-xl border border-border/30 text-center">
                                                            <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Min Order</div>
                                                            <div className="font-black text-foreground text-base">{l.minOrder}kg</div>
                                                        </div>
                                                        <div className="px-4 py-3 bg-muted/20 rounded-xl border border-border/30 text-center">
                                                            <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Available</div>
                                                            <div className="font-black text-foreground text-base">{l.qty}kg</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Qty Selector */}
                                                <div className="flex items-center gap-3 mb-6 bg-muted/10 p-1.5 rounded-xl border border-border/10">
                                                    <div className="flex items-center flex-1">
                                                        <button
                                                            onClick={() => handleQtyChange(l.id, -25, l.minOrder)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background text-foreground font-black text-base hover:bg-muted transition-colors shadow-sm cursor-pointer"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="flex-1 text-center font-black text-xs text-foreground">
                                                            {qty}<span className="text-[9px] ml-0.5 text-muted-foreground uppercase">kg</span>
                                                        </span>
                                                        <button
                                                            onClick={() => handleQtyChange(l.id, 25, l.minOrder)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background text-primary font-black text-base hover:bg-muted transition-colors shadow-sm cursor-pointer"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="pr-3 text-right">
                                                        <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Total</div>
                                                        <div className="text-sm font-black text-primary">₹{(l.price * qty).toLocaleString('en-IN')}</div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05, backgroundColor: inCart ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.1)' }}
                                                        whileTap={{ scale: 0.92 }}
                                                        onClick={() => handleAddToCart(l)}
                                                        className={`w-14 h-14 rounded-xl font-black flex items-center justify-center transition-all duration-300 border-2 border-primary/10 shadow-lg group/cart ${addedFlash === l.id ? 'bg-green-500 border-green-500 scale-95' : inCart ? 'bg-primary text-white' : 'bg-white dark:bg-zinc-800 text-primary'
                                                            }`}
                                                    >
                                                        <span className={`text-lg group-hover:scale-125 transition-transform ${addedFlash === l.id ? 'text-white' : ''}`}>
                                                            {addedFlash === l.id ? <Check className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                                                        </span>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setShowOrderFlow(l.id)}
                                                        className="flex-1 h-14 bg-gradient-to-r from-primary via-emerald-600 to-emerald-800 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-[0_10px_30px_rgba(45,80,22,0.3)] hover:shadow-[0_20px_40px_rgba(45,80,22,0.5)] transition-all flex items-center justify-center gap-2 group/order relative overflow-hidden active:brightness-110"
                                                    >
                                                        <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                                                        <div className="absolute h-full w-20 bg-white/20 skew-x-12 -left-20 group-hover:animate-[shimmer_2s_infinite]" />
                                                        <Package className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                                                        <span className="relative z-10">Place Bulk Order</span>
                                                    </motion.button>
                                                </div>

                                                {showOrderFlow === l.id && (
                                                    <OrderFlow
                                                        item={{
                                                            ...l,
                                                            localizedName: l.name,
                                                            emoji,
                                                            farmer: farmer.name,
                                                            farmerId: farmer.id,
                                                            farmerPhone: farmer.phone.replace(/\s+/g, '')
                                                        }}
                                                        qty={qty}
                                                        onClose={() => setShowOrderFlow(null)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Tab 2: Farm Story */}
                    {activeTab === 1 && (
                        <motion.div
                            key="story"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
                        >
                            <div>
                                <h2 className="text-3xl font-black text-foreground mb-8 font-display">Our Philosophy</h2>
                                <div className="mb-10">
                                    <AIStory rawStory={farmer.story} farmerName={farmer.name} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-12">
                                    {['🌱 No Pesticides', '💧 Natural Irrigation', '🌍 Carbon Neutral', '🔬 Lab Tested'].map(tag => (
                                        <div key={tag} className="p-4 bg-card border border-border/50 rounded-2xl text-sm font-black text-foreground shadow-sm flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            {tag}
                                        </div>
                                    ))}
                                </div>

                                <div className="glass-card p-10 bg-gradient-to-br from-primary/10 to-transparent border-none">
                                    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                        <Award className="w-6 h-6 text-primary" />
                                        Certified Organic
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed">This farm is verified by the Gujarat Organic Products Certification Agency (GOPCA) and adheres to global standards for sustainable agriculture.</p>
                                    <button className="w-full py-5 bg-white text-primary border-2 border-primary/20 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/5 transition-colors shadow-xl">View Certification</button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-foreground mb-10 font-display">Traceability Journey</h2>
                                <div className="relative pl-10 border-l-4 border-dashed border-border ml-5 space-y-12">
                                    {[
                                        { title: 'Seeds Sown', date: '4 Months Ago', icon: '🌱', desc: 'High-quality organic seeds planted.' },
                                        { title: 'Soil Enrichment', date: '3 Months Ago', icon: '🍂', desc: 'Compost and natural mulch added.' },
                                        { title: 'Quality Check', date: 'Last Week', icon: '🔬', desc: 'Pre-harvest residue testing completed.' },
                                        { title: 'Harvest Day', date: '2 Days Ago', icon: '✂️', desc: 'Carefully picked by hand at peak ripeness.' }
                                    ].map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative"
                                        >
                                            <div className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-background border-4 border-primary shadow-lg flex items-center justify-center text-sm z-10">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">{step.icon}</span>
                                                    <h4 className="font-black text-lg text-foreground">{step.title}</h4>
                                                </div>
                                                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{step.date}</div>
                                                <p className="text-muted-foreground text-sm">{step.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Tab 3: Reviews */}
                    {activeTab === 2 && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="glass-card p-12 text-center mb-12 border-none shadow-2xl relative overflow-hidden bg-gradient-to-br from-background to-muted">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                <div className="text-7xl font-black text-foreground font-display mb-4 tracking-tighter">{farmer.rating}</div>
                                <div className="flex justify-center mb-4"><StarRating rating={farmer.rating} large /></div>
                                <div className="text-sm font-black text-muted-foreground uppercase tracking-widest">Based on {farmer.reviews} Verified Transactions</div>
                                <div className="mt-10 flex justify-center gap-4">
                                    <div className="px-5 py-3 bg-green-500/10 text-green-600 rounded-xl text-xs font-black uppercase tracking-widest border border-green-500/20">98% Recommendation</div>
                                    <div className="px-5 py-3 bg-blue-500/10 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-500/20">Top 1% Farmer</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {farmer.reviews_list.map((r, i) => (
                                    <div key={i} className="glass-card p-8 border-none shadow-xl hover:shadow-2xl transition-all border-border/20 bg-card">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                                                    {r.buyer.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-lg text-foreground">{r.buyer}</div>
                                                    <div className="text-[10px] font-black text-primary uppercase tracking-widest">{r.type}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <StarRating rating={r.rating} />
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{r.date}</div>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Tab 4: Harvest Calendar */}
                    {activeTab === 3 && (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-foreground font-display">Future Yields</h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Updated Hourly</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {farmer.calendar.map((item, i) => (
                                    <div key={i} className="glass-card p-8 border-none shadow-xl hover:shadow-2xl transition-all flex items-center justify-between group bg-card">
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 rounded-[28px] bg-muted flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                                                {item.emoji}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">{item.crop}</h3>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                                        <CalendarIcon className="w-4 h-4" /> Ready {item.date}
                                                    </div>
                                                    <div className="text-sm font-black text-foreground">Estimated: {item.qty}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-4">
                                            <span style={{
                                                background: statusBg[item.status],
                                                color: statusColor[item.status],
                                            }} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                {item.status}
                                            </span>
                                            {item.status === 'Pre-book' && (
                                                <button className="px-6 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Pre-book Now</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
