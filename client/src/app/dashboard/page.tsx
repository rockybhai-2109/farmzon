'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Store,
    Image as ImageIcon,
    Calendar,
    Settings,
    LogOut,
    Plus,
    TrendingUp,
    Users,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function FarmerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'store', label: 'Manage Store', icon: Store },
        { id: 'gallery', label: 'Farm Gallery', icon: ImageIcon },
        { id: 'harvest', label: 'Harvest Calendar', icon: Calendar },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-organic-900 text-white flex flex-col p-6 fixed inset-y-0 left-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black">F</div>
                    <span className="text-xl font-black tracking-tighter">FarmerHub</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === item.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                    : 'text-organic-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <button className="flex items-center gap-4 px-4 py-3.5 text-red-300 font-bold hover:text-red-400 mt-auto">
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight capitalize">{activeTab}</h1>
                        <p className="text-gray-500 font-medium">Welcome back to your farm control center</p>
                    </div>
                    <Button className="rounded-2xl h-12 px-6 font-bold bg-white text-gray-900 border shadow-sm hover:bg-gray-50">
                        View My Public Site
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatsCard label="Total Sales" value="₹45,280" trend="+12%" icon={TrendingUp} />
                    <StatsCard label="Active Orders" value="14" trend="New" icon={Package} color="blue" />
                    <StatsCard label="Followers" value="842" trend="+5" icon={Users} color="purple" />
                    <StatsCard label="Public Views" value="2.4k" trend="+18%" icon={ImageIcon} color="amber" />
                </div>

                {/* Dashboard Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Store Management Section */}
                        <Card className="rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900">Current Harvest Items</h3>
                                <Button className="rounded-xl h-10 px-4 font-bold bg-primary hover:bg-green-600">
                                    <Plus className="w-4 h-4 mr-1" /> Add Product
                                </Button>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-50">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden">
                                                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150" alt="Product" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">Premium Tomatoes</h4>
                                                    <p className="text-xs text-gray-500 font-medium">₹40/kg • 450kg remaining</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" className="rounded-xl font-bold text-primary hover:bg-green-50">Edit</Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        {/* Mini Profile Preview */}
                        <Card className="rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 overflow-hidden bg-white">
                            <div className="h-32 bg-primary/10 relative">
                                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400" alt="Cover" className="w-full h-full object-cover opacity-30" />
                                <div className="absolute -bottom-10 left-8 w-20 h-20 bg-white p-1 rounded-2xl shadow-lg">
                                    <div className="w-full h-full bg-primary rounded-xl flex items-center justify-center font-black text-white text-2xl">R</div>
                                </div>
                            </div>
                            <CardContent className="pt-14 p-8">
                                <h4 className="text-xl font-black text-gray-900">Rajesh Patel</h4>
                                <p className="text-gray-500 text-sm font-medium mb-6">Organic Farmer • Anand, Gujarat</p>
                                <Button className="w-full h-12 rounded-xl border-2 border-gray-100 hover:border-primary hover:text-primary transition-all font-bold">
                                    Edit Mini Website
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ label, value, trend, icon: Icon, color = 'green' }: any) {
    const colors: any = {
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <Card className="rounded-3xl border-0 shadow-lg shadow-gray-200/50 bg-white overflow-hidden">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${colors[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {trend}
                    </span>
                </div>
                <h4 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">{label}</h4>
                <p className="text-2xl font-black text-gray-900">{value}</p>
            </CardContent>
        </Card>
    );
}
