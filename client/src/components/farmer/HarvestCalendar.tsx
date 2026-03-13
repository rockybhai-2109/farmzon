'use client';

import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

interface HarvestItem {
    id: string;
    month: string;
    cropName: string;
    expectedOutput?: string | null;
}

interface HarvestCalendarProps {
    items: HarvestItem[];
}

export const HarvestCalendarSection = ({ items }: HarvestCalendarProps) => {
    // Group by month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="py-12 bg-gray-50/50 rounded-3xl px-8 border border-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-primary" /> Harvest Calendar
                </h2>
                <p className="text-gray-500 font-medium mt-1">Planned harvests for the upcoming seasons</p>
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-primary font-black text-xs uppercase">
                                    {item.month.substring(0, 3)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{item.cropName}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{item.expectedOutput || 'Coming soon'}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-400 font-bold">No upcoming harvests scheduled yet.</p>
                </div>
            )}
        </div>
    );
};
