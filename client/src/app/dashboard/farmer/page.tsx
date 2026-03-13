'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Tractor, Package, TrendingUp, Truck } from 'lucide-react';

export default function FarmerDashboard() {
    const { user } = useAuth();

    const stats = [
        { label: 'Active Listings', value: '12', icon: Package, color: 'green' },
        { label: 'Pending Orders', value: '4', icon: Truck, color: 'blue' },
        { label: 'Monthly Earnings', value: '₹12,450', icon: TrendingUp, color: 'orange' },
    ];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}! 👋</h1>
                <p className="text-gray-500">Here's what's happening on your farm today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                    >
                        <div className={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mb-4 text-${stat.color}-600`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                    <Tractor size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">New order received for Tomatoes</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-green-600 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Ready to harvest?</h2>
                        <p className="text-green-100 mb-6 max-w-[200px]">Add your latest produce so buyers can start ordering from you!</p>
                        <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-all flex items-center gap-2">
                            <Package size={20} /> Add New Listing
                        </button>
                    </div>
                    <Tractor className="absolute -bottom-4 -right-4 text-green-500/30 rotate-12" size={200} />
                </div>
            </div>
        </div>
    );
}
