'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tractor,
    MapPin,
    Sprout,
    User,
    Phone,
    Check,
    ArrowRight,
    ArrowLeft,
    LocateFixed,
    Loader2
} from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';
import MiniMap from '@/components/location/MiniMap';
import CropSelector from '@/components/farmer/CropSelector';

export default function FarmerRegister() {
    const router = useRouter();
    const { userLocation, reverseGeocode, isLoading } = useLocation();
    const { language } = useLanguage();
    const [step, setStep] = useState(1);
    const [showMap, setShowMap] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        village: '',
        farmSize: '',
        experience: '',
        farmingType: 'Traditional',
        crops: '',
        transport: false,
        isOrganic: false,
        lat: null as number | null,
        lng: null as number | null
    });

    // Sync village name when userLocation changes via map or GPS
    React.useEffect(() => {
        if (userLocation) {
            setFormData(prev => ({
                ...prev,
                village: userLocation.city || userLocation.district || prev.village,
                lat: userLocation.lat,
                lng: userLocation.lng
            }));
        }
    }, [userLocation]);

    const handleLocateMe = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => reverseGeocode(pos.coords.latitude, pos.coords.longitude, language),
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual registration logic
        console.log('Registering farmer:', formData);
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-green-50/50 flex items-center justify-center p-4 py-12">
            <motion.div
                layout
                className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-green-100/50"
            >
                {/* Header */}
                <div className="bg-green-600 p-8 text-white relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Tractor size={28} />
                        </div>
                        <span className="bg-green-500/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                            Step {step} of 2
                        </span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Farmer Registration</h1>
                    <p className="text-green-100 font-medium opacity-80">Join the digital revolution in farming</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                            <User size={14} className="text-green-600" /> Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all outline-none font-bold text-gray-800"
                                            placeholder="Enter full name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                            <Phone size={14} className="text-green-600" /> Phone Number
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all outline-none font-bold text-gray-800"
                                            placeholder="+91 00000 00000"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                            <MapPin size={14} className="text-green-600" /> Village / Farm Location
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleLocateMe}
                                            className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:text-green-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 transition-colors"
                                        >
                                            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />}
                                            Use Live GPS
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <input
                                            required
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all outline-none font-bold text-gray-800 pr-32"
                                            placeholder="Detecting village..."
                                            value={formData.village}
                                            onChange={e => setFormData({ ...formData, village: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(!showMap)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
                                        >
                                            {showMap ? 'Hide Map' : 'Select from Map'}
                                        </button>
                                    </div>

                                    {showMap && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="pt-2"
                                        >
                                            <MiniMap />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Farm Size (Acres)</label>
                                        <input
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all outline-none font-bold text-gray-800"
                                            placeholder="e.g. 5"
                                            value={formData.farmSize}
                                            onChange={e => setFormData({ ...formData, farmSize: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Years of Experience</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all outline-none font-bold text-gray-800"
                                            placeholder="e.g. 10"
                                            value={formData.experience}
                                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 group uppercase tracking-widest text-sm"
                                >
                                    Next Step <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                        <Sprout size={14} className="text-green-600" /> Crops Grown
                                    </label>
                                    <CropSelector
                                        selectedCrops={formData.crops}
                                        onChange={(crops) => setFormData({ ...formData, crops })}
                                        language={language as any}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Farming Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Organic', 'Natural', 'Traditional'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, farmingType: type })}
                                                className={`py-4 rounded-2xl border-2 text-[10px] uppercase tracking-widest font-black transition-all ${formData.farmingType === type
                                                    ? 'bg-green-50 border-green-500 text-green-700'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.div
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData({ ...formData, transport: !formData.transport })}
                                        className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between cursor-pointer group ${formData.transport ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.transport ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-400'}`}>
                                                <Check size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-xs uppercase tracking-tight text-gray-700">Transport</p>
                                                <p className={`text-[10px] font-medium ${formData.transport ? 'text-green-600' : 'text-gray-400'}`}>Own delivery</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${formData.transport ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                                            {formData.transport && <Check size={14} className="text-white" />}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData({ ...formData, isOrganic: !formData.isOrganic })}
                                        className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between cursor-pointer group ${formData.isOrganic ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.isOrganic ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-400'}`}>
                                                <Check size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-xs uppercase tracking-tight text-gray-700">Certified</p>
                                                <p className={`text-[10px] font-medium ${formData.isOrganic ? 'text-green-600' : 'text-gray-400'}`}>Organic status</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${formData.isOrganic ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                                            {formData.isOrganic && <Check size={14} className="text-white" />}
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                    >
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
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
