'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    MapPin,
    User,
    Phone,
    Check,
    ArrowRight,
    ArrowLeft,
    Building2,
    Briefcase
} from 'lucide-react';

export default function BuyerRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        buyerType: 'RETAIL_CUSTOMER',
        businessName: '',
        weeklyQuantity: ''
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Registering buyer:', formData);
        router.push('/login');
    };

    const buyerTypes = [
        { id: 'VEGETABLE_SHOP', label: 'Vegetable Shop' },
        { id: 'RESTAURANT', label: 'Restaurant' },
        { id: 'DISTRIBUTOR', label: 'Distributor' },
        { id: 'RETAIL_CUSTOMER', label: 'Retail Customer' }
    ];

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 py-12">
            <motion.div
                layout
                className="max-w-2xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-blue-100"
            >
                {/* Header */}
                <div className="bg-blue-600 p-8 text-white relative">
                    <div className="flex items-center justify-between mb-2">
                        <ShoppingBag className="text-blue-200" size={32} />
                        <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Step {step} of 2
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold">Buyer Registration</h1>
                    <p className="text-blue-100">Sourcing fresh produce made easy</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <User size={16} /> Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                            placeholder="Jane Smith"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Phone size={16} /> Phone Number
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                            placeholder="+91 9876543210"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <MapPin size={16} /> City / Location
                                    </label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                        placeholder="Enter your city"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Briefcase size={16} /> Buyer Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {buyerTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, buyerType: type.id })}
                                                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all text-left ${formData.buyerType === type.id
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                                        : 'border-gray-100 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                                >
                                    Next Step <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Building2 size={16} /> Business Name (Optional)
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                        placeholder="e.g. Fresh Mart"
                                        value={formData.businessName}
                                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Estimated Weekly Purchase (kg)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                        placeholder="e.g. 500"
                                        value={formData.weeklyQuantity}
                                        onChange={e => setFormData({ ...formData, weeklyQuantity: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This helps us recommend the best farmers for your scale</p>
                                </div>

                                <div className="flex gap-4 pt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={20} /> Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                    >
                                        Complete Signup <Check size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    );
}
