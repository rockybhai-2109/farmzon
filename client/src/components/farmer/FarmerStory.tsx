'use client';

import React from 'react';
import { Quote, Droplets, Sprout, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FarmerStoryProps {
    bio: string | null;
    farmingType: string;
    methods: {
        fertilizers: string | null;
        pestControl: string | null;
        waterSystem: string | null;
    };
    name: string;
}

export const FarmerStory = ({ bio, farmingType, methods, name }: FarmerStoryProps) => {
    return (
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Story Section */}
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-widest border border-green-200 mb-6">
                    <Quote className="w-3 h-3" /> Our Story
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-6">
                    Meet the Farmer: <span className="text-primary">{name}</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                    {bio || `${name} has been dedicated to ${farmingType} farming for years, bringing the freshest organic produce to your table with love and care for the land.`}
                </p>

                <div className="mt-10 grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="font-black text-gray-900 mb-2">Sustainable</h4>
                        <p className="text-sm text-gray-500 font-medium">Committed to 100% eco-friendly practices.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="font-black text-gray-900 mb-2">Traceable</h4>
                        <p className="text-sm text-gray-500 font-medium">Every harvest is tracked from seed to sale.</p>
                    </div>
                </div>
            </div>

            {/* Methods Section */}
            <div className="bg-organic-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="w-32 h-32" />
                </div>

                <h3 className="text-3xl font-black mb-8 relative z-10">Organic Farming Methods</h3>

                <div className="space-y-8 relative z-10">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Sprout className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">Natural Fertilizers</h4>
                            <p className="text-organic-200 text-sm font-medium">{methods.fertilizers || 'Liquid Jeevamrut & Compost'}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">Organic Pest Control</h4>
                            <p className="text-organic-200 text-sm font-medium">{methods.pestControl || 'Neem Oil & Natural Extracts'}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Droplets className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">Water Management</h4>
                            <p className="text-organic-200 text-sm font-medium">{methods.waterSystem || 'Drip Irrigation System'}</p>
                        </div>
                    </div>
                </div>

                <Button className="w-full mt-10 h-14 rounded-2xl bg-white text-organic-950 font-black hover:bg-organic-50 tracking-tight">
                    VIEW CERTIFICATION
                </Button>
            </div>
        </div>
    );
};
