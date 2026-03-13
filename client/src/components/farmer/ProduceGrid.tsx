'use client';

import React from 'react';
import { ShoppingCart, Zap, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Product {
    id: string;
    name: string;
    pricePerKg: number;
    quantityAvailable: number;
    unit: string;
    organicType: string;
    images: string[];
    harvestDate: string;
}

interface ProduceGridProps {
    products: Product[];
}

export const ProduceGrid = ({ products }: ProduceGridProps) => {
    return (
        <div className="py-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-gray-900">Available Produce</h2>
                    <p className="text-gray-500 font-medium">Freshly harvested from the fields today</p>
                </div>
                <div className="hidden md:flex gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                        Bulk Inquiries Available
                    </span>
                </div>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl">
                            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                <img
                                    src={product.images[0] || `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400`}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    <div className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary flex items-center gap-1 shadow-sm border border-green-50">
                                        <Zap className="h-3 w-3 fill-current" /> FRESH
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                    <div className="text-white">
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">{product.organicType}</span>
                                        <h3 className="text-xl font-bold">{product.name}</h3>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-5">
                                <div className="flex justify-between items-center mb-4 text-sm font-bold">
                                    <div className="text-gray-900">
                                        <span className="text-2xl font-black">₹{product.pricePerKg}</span>
                                        <span className="text-gray-400 font-medium lowercase">/{product.unit}</span>
                                    </div>
                                    <div className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                        Qty: {product.quantityAvailable}{product.unit}
                                    </div>
                                </div>

                                <div className="text-[11px] text-gray-500 font-medium mb-6 flex items-center gap-2">
                                    <CalendarIcon /> Harvested: {new Date(product.harvestDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="rounded-xl font-bold border-2 hover:bg-gray-50 active:scale-95 transition-all">
                                        <Info className="w-4 h-4 mr-1.5" /> DETAILS
                                    </Button>
                                    <Button className="rounded-xl font-black bg-primary hover:bg-green-600 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                                        <ShoppingCart className="w-4 h-4 mr-1.5" /> ADD
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-2xl p-20 text-center border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-xl">No produce currently listed.</p>
                </div>
            )}
        </div>
    );
};

function CalendarIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
    )
}
