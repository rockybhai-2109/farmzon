'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LanguageToggle from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import {
    LayoutDashboard,
    User,
    Settings,
    LogOut,
    Bell,
    ChevronDown,
    Store,
    BarChart2,
    Users,
    Truck,
    Menu,
    X,
    CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TFunction = (key: string) => string;

const navLinks = (t: TFunction) => [
    { href: '/market', label: t('nav_market'), icon: Store },
    { href: '/mandi-prices', label: t('nav_mandi_prices'), icon: BarChart2 },
    { href: '/farmers', label: t('nav_farmers'), icon: Users },
    { href: '/transport', label: t('nav_transport'), icon: Truck },
];

const notifications = [
    { id: 1, icon: Store, text: 'Fresh Mart wants 200kg Tomatoes', time: '2m ago', read: false },
    { id: 2, icon: CheckCircle, text: '₹5,600 received for order #ORD001', time: '1h ago', read: false },
    { id: 3, icon: BarChart2, text: 'Tomato prices rising in your area', time: '3h ago', read: true },
    { id: 4, icon: CheckCircle, text: 'Your farm has been verified!', time: '1d ago', read: true },
];

export default function Navigation() {
    const { t, language, setLanguage } = useLanguage();
    const { user, logout } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifs, setNotifs] = useState(notifications);
    const pathname = usePathname();
    const router = useRouter();

    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const currentNavLinks = navLinks(t);
    const unread = notifs.filter(n => !n.read).length;

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (drawerOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    const dashboardHref = user?.role === 'FARMER' ? '/dashboard/farmer' : '/dashboard/buyer';

    return (
        <>
            <nav className="sticky top-0 z-[1000] bg-[#3D2B1F] h-16 flex items-center px-4 lg:px-8 gap-4 shadow-xl border-b border-white/5">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
                    <div className="w-10 h-10 bg-[#C5E063] rounded-xl flex items-center justify-center text-[#3D2B1F] group-hover:rotate-12 transition-transform shadow-lg shadow-[#C5E063]/20">
                        <Store size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="font-serif text-[#C5E063] text-xl font-bold leading-none tracking-tight">KisanMart</div>
                        <div className="text-[#F4A837] text-[10px] letter-spacing-[2px] font-bold opacity-80 uppercase">Wholesale Organic</div>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex gap-1 ml-6 flex-1">
                    {currentNavLinks.map(link => {
                        const isActive = pathname?.startsWith(link.href);
                        return (
                            <Link key={link.href} href={link.href} className={`
                                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
                                ${isActive ? 'bg-[#4A7C28] text-[#C5E063]' : 'text-stone-400 hover:text-white hover:bg-white/5'}
                            `}>
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side Actions */}
                <div className="flex items-center gap-3 ml-auto">
                    <div className="hidden lg:flex">
                        <LanguageToggle />
                    </div>

                    <div className="hidden lg:flex ml-1">
                        <ThemeToggle />
                    </div>

                    {/* Notification Bell */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all relative"
                        >
                            <Bell size={20} />
                            {unread > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#C85A2A] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#3D2B1F] animate-pulse">
                                    {unread}
                                </span>
                            )}
                        </button>

                        {notifOpen && (
                            <div className="absolute top-[calc(100%+12px)] right-0 w-80 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                                <div className="p-5 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
                                    <span className="font-serif font-black text-[#3D2B1F]">Notifications</span>
                                    <button onClick={markAllRead} className="text-xs font-bold text-green-600 hover:text-green-700">Mark all read</button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifs.map(n => (
                                        <div key={n.id} className={`p-4 flex gap-4 border-b border-gray-50 transition-colors cursor-pointer ${n.read ? 'bg-white' : 'bg-green-50/30'}`}>
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                <n.icon size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-bold'}`}>{n.text}</p>
                                                <p className="text-[11px] text-gray-400 mt-1 font-medium">{n.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile Menu */}
                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                                className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className="flex flex-col items-end mr-1 hidden lg:flex">
                                    <span className="text-[11px] font-black text-[#C5E063] leading-none uppercase tracking-widest">{user.role}</span>
                                    <span className="text-sm font-bold text-white truncate max-w-[100px]">{user.name}</span>
                                </div>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner ${user.role === 'FARMER' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown size={14} className={`text-white/40 group-hover:text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-64 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                                    <div className="p-5 bg-gray-50/50 border-b border-gray-100 text-center">
                                        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-3 shadow-lg ${user.role === 'FARMER' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{user.phone}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link href={dashboardHref} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-all group">
                                            <LayoutDashboard size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                                            Dashboard
                                        </Link>
                                        <Link href="/profile/edit" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-all group">
                                            <User size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                                            Edit Profile
                                        </Link>
                                        <div className="h-px bg-gray-100 my-2 mx-2" />
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all group"
                                        >
                                            <LogOut size={18} className="text-red-400 group-hover:text-red-600 transition-colors" />
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-[#C5E063] text-[#3D2B1F] px-6 py-2.5 rounded-xl text-sm font-black hover:bg-[#D6EF74] active:scale-95 transition-all shadow-lg shadow-[#C5E063]/20 uppercase"
                        >
                            Sign In
                        </Link>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/60 z-[1001] backdrop-blur-sm"
                            onClick={() => setDrawerOpen(false)}
                        />
                        <div className="fixed top-0 left-0 h-full w-[300px] bg-[#3D2B1F] z-[1002] flex flex-col shadow-2xl">
                            <div className="p-6 flex justify-between items-center border-b border-white/10">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#C5E063] rounded-lg flex items-center justify-center text-[#3D2B1F]">
                                        <Store size={18} strokeWidth={2.5} />
                                    </div>
                                    <span className="font-serif font-black text-[#C5E063] text-lg">KisanMart</span>
                                </Link>
                                <button onClick={() => setDrawerOpen(false)} className="text-white/40 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="space-y-2 mb-8">
                                    {currentNavLinks.map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setDrawerOpen(false)}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-stone-200 font-bold hover:bg-white/10 transition-all border border-transparent active:border-[#C5E063]/30"
                                        >
                                            <link.icon size={20} className="text-[#C5E063]" />
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {user && (
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-black ${user.role === 'FARMER' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold leading-tight">{user.name}</h3>
                                                <p className="text-[#C5E063] text-[10px] font-black uppercase tracking-widest mt-1">{user.role}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            <Link href={dashboardHref} className="flex items-center gap-3 py-3 text-stone-300 font-bold hover:text-white">
                                                <LayoutDashboard size={18} /> Dashboard
                                            </Link>
                                            <Link href="/profile/edit" className="flex items-center gap-3 py-3 text-stone-300 font-bold hover:text-white">
                                                <User size={18} /> Edit Profile
                                            </Link>
                                            <button onClick={logout} className="flex items-center gap-3 py-3 text-red-400 font-bold text-left">
                                                <LogOut size={18} /> Log Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-black/20 flex gap-4 overflow-x-auto no-scrollbar">
                                <LanguageToggle />
                                <ThemeToggle />
                            </div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
