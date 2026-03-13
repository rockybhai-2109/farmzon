'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    MessageSquare,
    User,
    LogOut,
    PlusCircle,
    Truck,
    TrendingUp,
    Settings,
    Menu,
    X
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) {
        if (typeof window !== 'undefined') router.push('/login');
        return null;
    }

    const isFarmer = user.role === 'FARMER';
    const themeColor = isFarmer ? 'green' : 'blue';

    // Simple route protection
    React.useEffect(() => {
        const path = window.location.pathname;
        if (isFarmer && path.startsWith('/dashboard/buyer')) {
            router.push('/dashboard/farmer');
        } else if (!isFarmer && path.startsWith('/dashboard/farmer')) {
            router.push('/dashboard/buyer');
        }
    }, [isFarmer, router]);

    const farmerNav = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/farmer' },
        { name: 'My Products', icon: Package, href: '/dashboard/farmer/products' },
        { name: 'Add Product', icon: PlusCircle, href: '/dashboard/farmer/add-product' },
        { name: 'Incoming Orders', icon: Truck, href: '/dashboard/farmer/orders' },
        { name: 'Earnings', icon: TrendingUp, href: '/dashboard/farmer/earnings' },
        { name: 'Messages', icon: MessageSquare, href: '/dashboard/farmer/chat' },
    ];

    const buyerNav = [
        { name: 'Browse Market', icon: LayoutDashboard, href: '/market' },
        { name: 'My Orders', icon: ShoppingCart, href: '/dashboard/buyer/orders' },
        { name: 'Favorite Farmers', icon: User, href: '/dashboard/buyer/favorites' },
        { name: 'Messages', icon: MessageSquare, href: '/dashboard/buyer/chat' },
    ];

    const navItems = isFarmer ? farmerNav : buyerNav;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-${themeColor}-600 flex items-center justify-center text-white`}>
                                <Package size={20} />
                            </div>
                            <span className="text-xl font-bold">FarmZon</span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${themeColor === 'green'
                                    ? 'hover:bg-green-50 text-gray-600 hover:text-green-600'
                                    : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                                    }`}
                            >
                                <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="font-semibold text-sm">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all font-semibold text-sm"
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-gray-100 p-4 flex items-center justify-between lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <Menu />
                    </button>
                    <span className="font-bold text-xl">FarmZon</span>
                    <div className="w-6" />
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
