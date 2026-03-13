'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Camera, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function ProfileEditPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        bio: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                location: '', // We would fetch this from profile
                bio: '',
            });
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
        setLoading(false);
        router.back();
    };

    if (!user) return null;

    const themeColor = user.role === 'FARMER' ? 'green' : 'blue';

    return (
        <div className={`min-h-screen bg-gray-50 pb-20`}>
            {/* Header Area */}
            <div className={`bg-${themeColor}-600 pt-12 pb-24 px-6 text-white relative overflow-hidden`}>
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl font-black mb-2">Edit Profile</h1>
                    <p className={`text-${themeColor}-100 font-medium opacity-80 uppercase tracking-widest text-xs`}>Manage your {user.role.toLowerCase()} account</p>
                </div>
                {/* Abstract shapes */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32`} />
                <div className={`absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-24 -mb-24`} />
            </div>

            {/* Form Area */}
            <div className="max-w-xl mx-auto -mt-16 px-6 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] shadow-2xl shadow-black/5 overflow-hidden border border-white"
                >
                    <div className="p-8">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative group">
                                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl ${user.role === 'FARMER' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-green-600 hover:scale-110 transition-all">
                                    <Camera size={20} />
                                </button>
                            </div>
                            <p className="mt-4 text-sm font-bold text-gray-500">Change Profile Photo</p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-green-500/20 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        disabled
                                        className="w-full bg-gray-100 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-500 cursor-not-allowed"
                                    />
                                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Location / Village</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-green-500/20 transition-all"
                                        placeholder="e.g. Navsari, Gujarat"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3
                                    ${user.role === 'FARMER' ? 'bg-green-600 shadow-green-200' : 'bg-blue-600 shadow-blue-200'}
                                    text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50
                                `}
                            >
                                {loading ? 'Saving Changes...' : <><Save size={20} /> Save Changes</>}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
