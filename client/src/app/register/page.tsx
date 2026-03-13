'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tractor, ShoppingBag, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full text-center mb-12"
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Join FarmZon</h1>
                <p className="text-xl text-gray-600">Select your account type to get started</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Farmer Option */}
                <Link href="/register/farmer">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-green-500 cursor-pointer group transition-all"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                            <Tractor size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join as Farmer</h2>
                        <ul className="text-gray-600 mb-8 space-y-3 text-left">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                List your fresh produce
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                Receive bulk orders directly
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                Manage your farm profile
                            </li>
                        </ul>
                        <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                            Start Selling <ArrowRight size={20} className="ml-2" />
                        </div>
                    </motion.div>
                </Link>

                {/* Buyer Option */}
                <Link href="/register/buyer">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-blue-500 cursor-pointer group transition-all"
                    >
                        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join as Buyer</h2>
                        <ul className="text-gray-600 mb-8 space-y-3 text-left">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                Access wholesale prices
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                Connect with local farmers
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                Recurring orders for your shop
                            </li>
                        </ul>
                        <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                            Start Buying <ArrowRight size={20} className="ml-2" />
                        </div>
                    </motion.div>
                </Link>
            </div>

            <p className="mt-12 text-gray-500">
                Already have an account? <Link href="/login" className="text-green-600 font-semibold">Login here</Link>
            </p>
        </div>
    );
}
