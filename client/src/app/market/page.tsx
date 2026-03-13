'use client';

import React, { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useInventory } from '@/context/InventoryContext';
import { useLocation } from '@/context/LocationContext';
import { VEGETABLE_NAMES } from '@/data/gujaratData';
import OrderFlow from '@/components/OrderFlow';
import CartDrawer from '@/components/CartDrawer';
import { PricePredictor } from '@/components/PricePredictor';
import { ImpactBadges } from '@/components/farmer/ImpactBadges';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton, ListingSkeleton } from '@/components/ui/Skeleton';
import { TrustBadge } from '@/components/ui/TrustBadges';

// Farmer phone numbers (demo)
const FARMER_PHONES: Record<number, string> = {
    1: '919876543210',
    2: '919876543211',
    3: '919876543212',
};

function FreshnessBar({ percent }: { percent: number }) {
    const color = percent >= 90 ? '#16A34A' : percent >= 70 ? '#D97706' : '#DC2626';
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>ताजगी / Freshness</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color }}>{percent}%</span>
            </div>
            <div style={{ height: '5px', borderRadius: '3px', background: '#E5E7EB', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percent}%`, borderRadius: '3px', background: color, transition: 'width 0.6s ease' }} />
            </div>
        </div>
    );
}

function VeggieCard({ item, onOpenCart }: { item: any; onOpenCart: () => void }) {
    const { t, language } = useLanguage();
    const { userLocation, calculateDistance } = useLocation();
    const { addToCart, isInCart, getItemQty } = useCart();
    const [qty, setQty] = useState(item.minOrder);
    const [showOrderFlow, setShowOrderFlow] = useState(false);
    const [addedFlash, setAddedFlash] = useState(false);

    // Localized name
    const cropKey = Object.keys(VEGETABLE_NAMES).find(
        k => k.toLowerCase() === item.name.toLowerCase()
    ) || item.name;
    const localizedName = (VEGETABLE_NAMES as any)[cropKey]?.[language] || item.name;
    const emoji = (VEGETABLE_NAMES as any)[cropKey]?.emoji || item.emoji;

    const total = item.price * qty;
    const inCart = isInCart(item.id);
    const cartQty = getItemQty(item.id);

    const freshnessColor = item.freshness === 100 ? '#15803D' : item.freshness >= 90 ? '#92400E' : '#6B7280';
    const freshnessLabel = item.freshness === 100 ? '🌱 આજ કાઢ્યું' : item.freshness >= 90 ? '✨ ગઈ કાલ' : '📦 ताजा';

    // Calculate Distance
    const distanceVal = userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng)
        : null;
    const distanceString = distanceVal !== null
        ? `${distanceVal.toFixed(1)} ${language === 'gu' ? 'કિમી દૂર' : 'किमी दूर'}`
        : '';

    // Build WhatsApp quick-order deep link
    const waMsg = encodeURIComponent(
        `🌾 *KisanMart ઓર્ડર*\n\nશાકભાજી: ${localizedName} ${emoji}\nજથ્થો: ${qty} કિ.ગ્રા.\nભાવ: ₹${item.price}/કિ.ગ્રા.\nકુલ: ₹${total.toLocaleString('en-IN')}\n\nKisanMart પ્લેટફોર્મ દ્વારા — confirm કરો 🙏`
    );
    const waLink = `https://wa.me/${FARMER_PHONES[item.farmerId] || '91xxxxxxxxxx'}?text=${waMsg}`;

    const handleAddToCart = () => {
        addToCart({
            id: item.id, name: item.name, localizedName, emoji,
            farmer: item.farmer, farmerId: item.farmerId,
            farmerPhone: FARMER_PHONES[item.farmerId] || '91xxxxxxxxxx',
            location: item.location, price: item.price,
            qty, minOrder: item.minOrder, organic: item.organic,
        });
        setAddedFlash(true);
        setTimeout(() => { setAddedFlash(false); onOpenCart(); }, 400);
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group"
                style={{
                    background: 'var(--card)',
                    borderRadius: '24px',
                    border: inCart ? '2px solid var(--primary)' : 'none',
                }}
            >
                {/* In-cart indicator */}
                {inCart && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--primary)', color: 'white', borderRadius: '50px', padding: '6px 14px', fontSize: '10px', fontWeight: 900, zIndex: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        ✓ {cartQty} {t('qty_kg')} In Cart
                    </div>
                )}

                {/* Top — emoji + name */}
                <div className="relative pt-12 pb-8 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.5))] -z-10" />
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        style={{ fontSize: '72px', marginBottom: '16px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
                    >
                        {emoji}
                    </motion.div>
                    <h3 className="font-black text-2xl text-foreground mb-1 font-display tracking-tight">{localizedName}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-bold uppercase tracking-widest">
                        <span className="text-secondary">🌾</span> {item.farmer} · <span className="opacity-60">📍 {item.location}</span>
                    </div>
                    {distanceString && (
                        <div className="mt-3 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-black border border-green-200 dark:border-green-800 animate-bounce">
                            🏃 {distanceString}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Impact Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {item.organic && <TrustBadge type="organic" size="sm" />}
                        {item.freshness >= 95 && <TrustBadge type="verified" size="sm" />}
                        <TrustBadge type="premium" size="sm" showLabel={false} />
                    </div>

                    {/* Price + prediction toggle area (simplified for card) */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Direct Farm Price</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-primary font-display">₹{item.price}</span>
                                <span className="text-sm font-bold text-muted-foreground">/{t('qty_kg')}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-xs font-black text-secondary uppercase tracking-wider mb-1">
                                {item.trend === '📈' ? <span className="text-green-500">Bullish</span> : <span className="text-amber-500">Stable</span>}
                            </div>
                            <div className="text-[20px]">{item.trend}</div>
                        </div>
                    </div>

                    {/* Freshness & Stock */}
                    <div className="space-y-6 mb-8">
                        <FreshnessBar percent={item.freshness} />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Available Qty</div>
                                <div className="text-sm font-black text-foreground">{item.qty} {t('qty_kg')}</div>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Min Order</div>
                                <div className="text-sm font-black text-foreground">{item.minOrder} {t('qty_kg')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Qty Selector */}
                    <div className="flex items-center gap-4 mb-8 bg-muted/20 p-2 rounded-2xl border border-border/20">
                        <div className="flex items-center flex-1">
                            <button onClick={() => setQty(Math.max(item.minOrder, qty - 25))}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-background text-foreground font-black text-xl hover:bg-muted transition-colors shadow-sm cursor-pointer">−</button>
                            <span className="flex-1 text-center font-black text-lg text-foreground">{qty}<span className="text-xs ml-1 text-muted-foreground uppercase">{t('qty_kg')}</span></span>
                            <button onClick={() => setQty(qty + 25)}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-background text-primary font-black text-xl hover:bg-muted transition-colors shadow-sm cursor-pointer">+</button>
                        </div>
                        <div className="pr-4 text-right">
                            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total</div>
                            <div className="text-lg font-black text-primary">₹{total.toLocaleString('en-IN')}</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button onClick={handleAddToCart}
                            className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-xs transition-all duration-300 shadow-xl ${addedFlash
                                ? 'bg-green-500 text-white scale-95'
                                : inCart
                                    ? 'bg-primary/10 text-primary border-2 border-primary'
                                    : 'bg-primary text-white hover:translate-y-[-2px] shadow-primary/20'
                                }`}
                        >
                            {addedFlash ? '✓ Added to Cart' : inCart ? `+ Add More` : t('add_to_cart')}
                        </button>
                        <a href={waLink} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center rounded-2xl bg-[#25D366] text-white text-xl hover:bg-[#22c35e] transition-colors shadow-lg shadow-green-500/20">
                            📱
                        </a>
                        <button onClick={() => setShowOrderFlow(true)}
                            className="flex-1 flex items-center justify-center rounded-2xl bg-muted text-foreground text-xl hover:bg-muted/80 transition-colors border border-border/50">
                            📋
                        </button>
                    </div>
                </div>
            </motion.div>

            {showOrderFlow && (
                <OrderFlow
                    item={{ ...item, localizedName, emoji, farmerPhone: FARMER_PHONES[item.farmerId] || '91xxxxxxxxxx' }}
                    qty={qty}
                    onClose={() => setShowOrderFlow(false)}
                />
            )}
        </>
    );
}

export default function MarketPage() {
    const { t, language } = useLanguage();
    const { cartCount, cartTotal } = useCart();
    const { listings } = useInventory();
    const { userLocation, calculateDistance } = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
    const [sort, setSort] = useState('freshness');
    const [cartOpen, setCartOpen] = useState(false);

    const categories = [
        { id: 'All', label: t('cat_all') },
        { id: 'Leafy Greens', label: t('cat_leafy') },
        { id: 'Root Vegetables', label: t('cat_root') },
        { id: 'Fruiting Vegetables', label: t('cat_fruit') },
        { id: 'Herbs & Spices', label: t('cat_herbs') },
    ];

    const districts = [
        { name: 'અમરેલી', price: '₹45', hot: true },
        { name: 'બનાસકાંઠા', price: '₹48', hot: true },
        { name: 'સાબરકાંઠા', price: '₹44', hot: true },
        { name: 'ભાવનગર', price: '₹42', hot: true },
    ];

    const filteredAndSorted = useMemo(() => {
        return listings
            .filter(item => {
                const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
                const matchesDistrict = !activeDistrict || item.location.includes(activeDistrict);

                const searchLower = searchQuery.toLowerCase();
                const cropKey = Object.keys(VEGETABLE_NAMES).find(k => k.toLowerCase() === item.name.toLowerCase()) || '';
                const locName = (VEGETABLE_NAMES as any)[cropKey]?.[language]?.toLowerCase() || '';

                const matchesSearch = !searchQuery ||
                    item.name.toLowerCase().includes(searchLower) ||
                    item.farmerEn.toLowerCase().includes(searchLower) ||
                    item.farmer.toLowerCase().includes(searchLower) ||
                    locName.includes(searchLower);

                return matchesCategory && matchesDistrict && matchesSearch;
            })
            .sort((a, b) => {
                if (sort === 'price_asc') return a.price - b.price;
                if (sort === 'price_desc') return b.price - a.price;
                if (sort === 'qty') return b.qty - a.qty;
                if (sort === 'distance' && userLocation) {
                    const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
                    const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
                    return distA - distB;
                }
                return b.freshness - a.freshness;
            });
    }, [listings, activeCategory, activeDistrict, searchQuery, sort, language, userLocation, calculateDistance]);

    return (
        <div style={{ background: '#F7F9F4', minHeight: '100vh', paddingBottom: '100px' }}>
            <Navigation />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 16px' }}>
                {/* Header Section with Search */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 5vw, 36px)', color: '#1F2937', margin: 0 }}>
                            {t('market_title')}
                        </h1>
                        <p style={{ color: '#6B7280', fontSize: '15px', marginTop: '6px' }}>
                            {t('market_subtitle', { listingCount: filteredAndSorted.length, farmerCount: 3 })}
                        </p>
                    </div>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', pointerEvents: 'none' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="શોધો (શાકભાજી, ખેડૂતનું નામ...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px', border: '2px solid #E5E7EB',
                                fontSize: '15px', fontWeight: 600, outline: 'none', transition: 'border-color 0.2s',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2D5016'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                    </div>
                </div>

                {/* AI Insights Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-2 mb-6 ml-1">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Market Deep Dive & Predictions</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <PricePredictor cropName="Commercial Tomato" currentPrice={45} />
                        </div>
                        <div className="glass-card p-8 flex flex-col justify-center bg-gradient-to-br from-secondary/10 to-transparent border-none">
                            <h3 className="text-xl font-black mb-4 font-display text-foreground">Weekly Overview</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                                    <span className="text-sm font-bold text-muted-foreground">Market Sentiment</span>
                                    <span className="text-sm font-black text-green-500 uppercase">Bullish</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                                    <span className="text-sm font-bold text-muted-foreground">Demand Spike</span>
                                    <span className="text-sm font-black text-foreground">Ahmedabad, Surat</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                                    <span className="text-sm font-bold text-muted-foreground">Supply Constraint</span>
                                    <span className="text-sm font-black text-amber-500">Leafy Greens</span>
                                </div>
                            </div>
                            <button className="mt-8 py-3 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/20 hover:scale-105 transition-transform">Get Full AI Report</button>
                        </div>
                    </div>
                </motion.div>

                {/* Gujarat Market Map Interaction */}
                <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#374151', margin: 0 }}>📍 ગુજરાત માર્કેટ — જિલ્લા મુજબ ફિલ્ટર</h3>
                            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>જિલ્લા ના પર ક્લિક કરો તે વિસ્તાર ના શાકભાજી જોવા માટે</p>
                        </div>
                        <span style={{ fontSize: '11px', background: '#FEE2E2', color: '#BE123C', padding: '4px 12px', borderRadius: '50px', fontWeight: 900 }}>● LIVE MARKET</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <button
                            onClick={() => setActiveDistrict(null)}
                            style={{
                                padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 800,
                                border: '2px solid', cursor: 'pointer', transition: 'all 0.15s',
                                background: !activeDistrict ? '#2D5016' : 'white',
                                borderColor: !activeDistrict ? '#2D5016' : '#F3F4F6',
                                color: !activeDistrict ? 'white' : '#6B7280',
                            }}
                        >
                            બધા જિલ્લા
                        </button>
                        {districts.map((d, i) => (
                            <button key={i} onClick={() => setActiveDistrict(activeDistrict === d.name ? null : d.name)} style={{
                                background: activeDistrict === d.name ? '#BE123C' : d.hot ? '#FFF1F2' : '#F0FDF4',
                                border: `2px solid ${activeDistrict === d.name ? '#BE123C' : d.hot ? '#FECDD3' : '#BBF7D0'}`,
                                padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                                cursor: 'pointer', color: activeDistrict === d.name ? 'white' : '#374151',
                                transition: 'all 0.2s', transform: activeDistrict === d.name ? 'scale(1.05)' : 'scale(1)',
                            }}>
                                <span style={{ fontSize: '13px', fontWeight: 800 }}>{d.name}</span>
                                <span style={{ fontSize: '13px', fontWeight: 900, color: activeDistrict === d.name ? 'white' : d.hot ? '#BE123C' : '#15803D' }}>{d.price}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter + Sort Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                                padding: '10px 18px', borderRadius: '50px', fontSize: '14px', fontWeight: 700,
                                border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                                background: activeCategory === cat.id ? '#3D2B1F' : 'white',
                                borderColor: activeCategory === cat.id ? '#3D2B1F' : '#E5E7EB',
                                color: activeCategory === cat.id ? 'white' : '#6B7280',
                            }}>{cat.label}</button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 14px', borderRadius: '14px', border: '1.5px solid #E5E7EB' }}>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700 }}>{t('sort_label')}</span>
                        <select value={sort} onChange={e => setSort(e.target.value)}
                            style={{ border: 'none', background: 'none', fontSize: '14px', fontWeight: 800, color: '#374151', cursor: 'pointer', outline: 'none' }}>
                            <option value="freshness">{t('sort_freshness')}</option>
                            <option value="distance">{t('sort_distance')}</option>
                            <option value="price_asc">{t('sort_price_low')}</option>
                            <option value="price_desc">{t('sort_price_high')}</option>
                            <option value="qty">{t('sort_qty')}</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {listings.length === 0 ? (
                        <>
                            {[1, 2, 3, 4, 5, 6].map(i => <ListingSkeleton key={i} />)}
                        </>
                    ) : (
                        filteredAndSorted.map(item => (
                            <VeggieCard key={item.id} item={item} onOpenCart={() => setCartOpen(true)} />
                        ))
                    )}
                    {filteredAndSorted.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
                            <h3 style={{ color: '#374151', fontWeight: 800, fontSize: '20px' }}>કેઈ પરિણામ મળ્યું નથી</h3>
                            <p style={{ color: '#9CA3AF', marginTop: '8px' }}>બીજું કઈ શોધી જુઓ અથવા ફિલ્ટર દૂર કરો</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveDistrict(null); }}
                                style={{ marginTop: '24px', background: '#2D5016', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer' }}
                            >
                                બધા ફિલ્ટર દૂર કરો
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating Cart FAB */}
            {cartCount > 0 && (
                <button onClick={() => setCartOpen(true)} style={{
                    position: 'fixed', bottom: '80px', right: '20px',
                    background: 'linear-gradient(135deg, #2D5016, #4A8025)',
                    color: 'white', border: 'none', borderRadius: '28px',
                    padding: '14px 22px', cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(45, 80, 22, 0.45)',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '15px', fontWeight: 900,
                    zIndex: 500, animation: 'fabPop 0.3s ease',
                }}>
                    <span style={{ fontSize: '22px' }}>🛒</span>
                    <div style={{ textAlign: 'left' }}>
                        <div>{cartCount} item{cartCount > 1 ? 's' : ''}</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.85 }}>₹{cartTotal.toLocaleString('en-IN')}</div>
                    </div>
                </button>
            )}

            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            <style jsx global>{`
                @keyframes fabPop {
                    from { transform: scale(0.8); opacity: 0; }
                    to   { transform: scale(1);   opacity: 1; }
                }
            `}</style>
        </div>
    );
}
