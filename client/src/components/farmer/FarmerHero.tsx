'use client';

import React from 'react';
import { MapPin, ShieldCheck, Tractor, Star, Calendar, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FarmerHeroProps {
    farmer: {
        name: string;
        village: string;
        state: string;
        farmSize: string;
        experienceYears: number;
        farmingType: string;
        profileImage: string | null;
        coverImage: string | null;
        isOrganicCertified: boolean;
        avgRating: number;
        totalOrders: number;
    };
}

export const FarmerHero = ({ farmer }: FarmerHeroProps) => {
    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="h-48 md:h-80 w-full overflow-hidden relative">
                <img
                    src={farmer.coverImage || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"}
                    alt="Farm Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 relative -mt-16 md:-mt-24 pb-8">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-end">
                    {/* Profile Image */}
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-50 flex-shrink-0">
                        <img
                            src={farmer.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=10b981&color=fff&size=200`}
                            alt={farmer.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left pt-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{farmer.name}</h1>
                            {farmer.isOrganicCertified && (
                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200 shadow-sm flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> VERIFIED ORGANIC
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 font-medium mb-6">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                                <MapPin className="w-4 h-4 text-primary" /> {farmer.village}, {farmer.state}
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                                <Tractor className="w-4 h-4 text-primary" /> {farmer.farmSize}
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                                <Calendar className="w-4 h-4 text-primary" /> {farmer.experienceYears} Years Exp.
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 border-t border-gray-100 pt-6">
                            <div className="text-center md:text-left">
                                <div className="flex items-center gap-1 text-amber-500 font-black text-xl mb-0.5">
                                    <Star className="w-5 h-5 fill-current" /> {farmer.avgRating.toFixed(1)}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</span>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="text-gray-900 font-black text-xl mb-0.5">{farmer.totalOrders}+</div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</span>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="text-primary font-black text-xl mb-0.5">{farmer.farmingType}</div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Farming</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto self-center md:self-end">
                        <Button className="rounded-full h-14 px-8 font-black text-lg bg-primary hover:bg-green-600 shadow-xl shadow-primary/30 transition-all active:scale-95 group">
                            <Phone className="w-5 h-5 mr-2" /> CALL FARMER
                        </Button>
                        <Button variant="outline" className="rounded-full h-14 px-8 font-black text-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all active:scale-95">
                            <MessageCircle className="w-5 h-5 mr-2 text-green-500" /> WHATSAPP
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
