import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useInventory, Listing } from '@/context/InventoryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Tractor, Package, TrendingUp, Truck, Plus, Minus, Zap, AlertCircle, CheckCircle2, ShoppingCart } from 'lucide-react';

export default function FarmerDashboard() {
    const { user } = useAuth();
    const { listings, updateListing, getFarmerListings } = useInventory();

    // In a real app, we'd use user?.id. For demo, we use a fixed ID or first farmer
    const farmerListings = getFarmerListings(user?.id || 1);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const stats = [
        { label: 'Active Listings', value: farmerListings.length.toString(), icon: Package, color: 'green' },
        { label: 'Pending Orders', value: '4', icon: Truck, color: 'blue' },
        { label: 'Monthly Earnings', value: '₹12,450', icon: TrendingUp, color: 'orange' },
    ];

    const handlePriceChange = (id: number, newPrice: number) => {
        setUpdatingId(id);
        updateListing(id, { price: newPrice });
        setTimeout(() => setUpdatingId(null), 1000);
    };

    const handleQtyChange = (id: number, delta: number) => {
        const item = farmerListings.find(l => l.id === id);
        if (item) {
            updateListing(id, { qty: Math.max(0, item.qty + delta) });
        }
    };

    const toggleStatus = (id: number, currentFreshness: number) => {
        // Mocking status toggle via freshness or a dedicated field if added
        // For now, let's just toggle a "Live" feel by adjusting freshness/stock
        const item = farmerListings.find(l => l.id === id);
        if (item) {
            updateListing(id, { freshness: currentFreshness === 0 ? 100 : 0 });
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 font-display tracking-tight">Kisan Dashboard</h1>
                    <p className="text-gray-500 font-medium">Manage your crops with high-speed controls.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus size={20} /> New Harvest
                    </button>
                </div>
            </header>

            {/* Smart Alerts */}
            <AnimatePresence>
                {farmerListings.some(l => l.qty < 50) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4 text-amber-700"
                    >
                        <AlertCircle className="text-amber-500 shrink-0" />
                        <div className="flex-1 text-sm font-bold">
                            Low Stock Alert: Some of your items are running low. Consider replenishing soon!
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest bg-amber-200 px-3 py-1 rounded-full">Restock Now</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 bg-white border-none shadow-xl relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`} />
                        <div className={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mb-4 text-${stat.color}-600`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1 font-display tracking-tight">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-secondary fill-secondary" />
                    <h2 className="text-xl font-black font-display tracking-tight">Active Harvest Grid</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farmerListings.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                                        {/* Mocking emoji based on name if available in listing or hardcoded map */}
                                        {item.name.toLowerCase().includes('tomato') ? '🍅' : item.name.toLowerCase().includes('onion') ? '🧅' : '🥦'}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg text-gray-900 leading-tight">{item.name}</h4>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className={`w-2 h-2 rounded-full ${item.freshness > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                {item.freshness > 0 ? 'Live on Market' : 'Sold Out'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleStatus(item.id, item.freshness)}
                                    className={`p-2 rounded-xl transition-colors ${item.freshness > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                >
                                    <CheckCircle2 size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Price Control */}
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Price per kg (Quick Edit)</label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary">₹</span>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handlePriceChange(item.id, parseInt(e.target.value))}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-3 pl-8 pr-4 font-black transition-all outline-none"
                                            />
                                        </div>
                                        {updatingId === item.id && (
                                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
                                                <CheckCircle2 size={20} />
                                            </motion.span>
                                        )}
                                    </div>
                                </div>

                                {/* Qty Control */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Stock Availability (kg)</label>
                                        <span className="text-sm font-black text-primary">{item.qty} kg</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100">
                                        <button
                                            onClick={() => handleQtyChange(item.id, -50)}
                                            className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mx-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (item.qty / 1000) * 100)}%` }}
                                                className={`h-full ${item.qty < 100 ? 'bg-red-500' : 'bg-primary'}`}
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleQtyChange(item.id, 50)}
                                            className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick Actions Footer (Mobile Optimized) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-xl border border-white/20 p-4 rounded-[32px] shadow-2xl z-50 flex justify-between gap-4">
                <button className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-primary">
                    <Tractor size={20} />
                    <span className="text-[9px] font-black uppercase tracking-wider">Farm</span>
                </button>
                <button className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-gray-400">
                    <ShoppingCart size={20} />
                    <span className="text-[9px] font-black uppercase tracking-wider">Orders</span>
                </button>
                <button className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-gray-400">
                    <TrendingUp size={20} />
                    <span className="text-[9px] font-black uppercase tracking-wider">Insights</span>
                </button>
            </div>
        </div>
    );
}
