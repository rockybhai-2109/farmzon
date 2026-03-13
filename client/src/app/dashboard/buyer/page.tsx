'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Package, Search } from 'lucide-react';
import Link from 'next/link';

export default function BuyerDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Hello, {user?.name}! 👋</h1>
                    <p className="text-gray-500">Find the best fresh produce for your business today.</p>
                </div>
                <Link href="/market" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 h-fit w-fit shadow-lg shadow-blue-200">
                    <Search size={20} /> Go to Marketplace
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                        <Package size={24} />
                    </div>
                    <h3 className="text-lg font-bold">In-transit Orders</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">2</p>
                    <Link href="/dashboard/buyer/orders" className="text-sm text-gray-500 hover:text-blue-600 mt-4 block underline underline-offset-4">Track orders</Link>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                >
                    <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4 text-pink-600">
                        <Heart size={24} />
                    </div>
                    <h3 className="text-lg font-bold">Favorite Farmers</h3>
                    <p className="text-3xl font-bold text-pink-600 mt-2">8</p>
                    <Link href="/dashboard/buyer/favorites" className="text-sm text-gray-500 hover:text-pink-600 mt-4 block underline underline-offset-4">View farmers</Link>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-blue-600 p-6 rounded-3xl shadow-lg text-white"
                >
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                        <ShoppingBag size={24} />
                    </div>
                    <h3 className="text-lg font-bold">New Harvests</h3>
                    <p className="text-sm text-blue-100 mt-2">15 farmers near you just updated their produce list.</p>
                    <Link href="/market" className="text-sm font-bold mt-4 block bg-white text-blue-600 w-fit px-4 py-2 rounded-xl">Explore Now</Link>
                </motion.div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <ShoppingBag size={40} />
                    </div>
                    <p className="text-gray-500 font-medium">No recent orders found.</p>
                    <Link href="/market" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Start searching</Link>
                </div>
            </div>
        </div>
    );
}
