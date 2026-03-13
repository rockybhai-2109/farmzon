'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { VEGETABLE_NAMES } from '@/data/gujaratData';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderHistoryPage() {
    const { t, language } = useLanguage();
    const { addToCart } = useCart();
    const [orders, setOrders] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem('kisanmart_order_history');
        if (saved) {
            setOrders(JSON.parse(saved));
        }
    }, []);

    const handleReorder = (order: any) => {
        // Find the original item data if possible, or build one from history
        // For simplicity, we'll re-add it to cart
        const cropKey = Object.keys(VEGETABLE_NAMES).find(
            k => k.toLowerCase() === order.item.toLowerCase() || (VEGETABLE_NAMES as any)[k][language] === order.item
        ) || 'Tomato';

        const item = {
            id: Math.random(), // In a real app, this would be the actual product ID
            name: order.item,
            localizedName: order.item,
            emoji: order.emoji,
            farmer: 'Farmer', // Mockup
            farmerId: 1,
            farmerPhone: '91xxxxxxxxxx',
            location: 'Gujarat',
            price: order.total / order.qty,
            qty: order.qty,
            minOrder: 10,
            organic: true
        };

        addToCart(item);
        router.push('/market');
    };

    return (
        <div style={{ background: '#F7F9F4', minHeight: '100vh', paddingBottom: '40px' }}>
            <Navigation />

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1F2937', margin: 0 }}>
                        {t('order_history_title')}
                    </h1>
                    <Link href="/market" style={{ color: '#2D5016', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
                        ← {t('nav_market')}
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', background: 'white', borderRadius: '24px', padding: '60px 20px', border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
                        <h3 style={{ color: '#9CA3AF', fontWeight: 600 }}>{t('no_orders_yet')}</h3>
                        <Link href="/market" style={{ display: 'inline-block', marginTop: '20px', background: '#2D5016', color: 'white', padding: '12px 24px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none' }}>
                            {t('market_title')}
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map((order, idx) => (
                            <div key={idx} style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ fontSize: '40px', background: '#F9FAFB', width: '70px', height: '70px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {order.emoji}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '18px', color: '#111827' }}>{order.item}</div>
                                        <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '2px' }}>
                                            {order.qty} કિ.ગ્રા. · ₹{order.total.toLocaleString('en-IN')}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                                            {t('order_placed_on')} {new Date(order.date).toLocaleDateString(language === 'gu' ? 'gu-IN' : 'en-IN', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <span style={{
                                        display: 'inline-block', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '50px',
                                        background: order.status === 'confirmed' ? '#DCFCE7' : '#FEF9C3',
                                        color: order.status === 'confirmed' ? '#166534' : '#854D0E'
                                    }}>
                                        {order.status === 'confirmed' ? t('order_status_confirmed') : t('order_status_pending')}
                                    </span>
                                    <button
                                        onClick={() => handleReorder(order)}
                                        style={{
                                            background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0',
                                            padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer'
                                        }}
                                    >
                                        {t('reorder_btn')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
