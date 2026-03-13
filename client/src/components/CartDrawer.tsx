'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import OrderFlow from '@/components/OrderFlow';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cartItems, cartTotal, cartCount, updateQty, removeFromCart, clearCart } = useCart();
    const { t, language } = useLanguage();
    const [orderItem, setOrderItem] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

    // Group items by farmer
    const farmerGroups = cartItems.reduce((groups, item) => {
        const key = item.farmerId;
        if (!groups[key]) groups[key] = { farmer: item.farmer, location: item.location, items: [] };
        groups[key].items.push(item);
        return groups;
    }, {} as Record<number, { farmer: string; location: string; items: typeof cartItems }>);

    const buildWhatsAppMsg = (farmerItems: typeof cartItems) => {
        const lines = farmerItems.map(i => `• ${i.localizedName}: ${i.qty} ${t('qty_kg')} × ₹${i.price} = ₹${(i.price * i.qty).toLocaleString('en-IN')}`).join('\n');
        return encodeURIComponent(`🌾 *KisanMart ઓર્ડર*\n\n${lines}\n\n💰 *કુલ: ₹${farmerItems.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString('en-IN')}*\n\nકૃપા કરીને confirm કરો 🙏`);
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(2px)' }}
                />
            )}

            {/* Drawer */}
            <div style={{
                position: 'fixed',
                bottom: 0, left: 0, right: 0,
                maxHeight: '88vh',
                background: 'white',
                borderRadius: '28px 28px 0 0',
                zIndex: 1001,
                transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '560px',
                margin: '0 auto',
            }}>
                {/* Handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                    <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#E5E7EB' }} />
                </div>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px 16px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#3D2B1F', margin: 0 }}>
                            🛒 {t('cart_title')} {cartCount > 0 && <span style={{ background: '#2D5016', color: 'white', padding: '2px 8px', borderRadius: '50px', fontSize: '13px', marginLeft: '6px' }}>{cartCount}</span>}
                        </h2>
                        {cartCount > 0 && <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7280' }}>₹{cartTotal.toLocaleString('en-IN')} {t('cart_total_label')}</p>}
                    </div>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px', color: '#6B7280' }}>×</button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
                    {cartCount === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
                            <h3 style={{ color: '#9CA3AF', fontWeight: 600 }}>{t('cart_empty')}</h3>
                            <p style={{ color: '#D1D5DB', fontSize: '14px' }}>{t('cart_empty_sub')}</p>
                        </div>
                    ) : (
                        <>
                            {Object.values(farmerGroups).map((group, gi) => (
                                <div key={gi} style={{ marginBottom: '24px', background: '#F9FAFB', borderRadius: '20px', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
                                    {/* Farmer header */}
                                    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', background: '#2D5016', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🌾</div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#166534' }}>{group.farmer}</div>
                                            <div style={{ fontSize: '12px', color: '#6B7280' }}>📍 {group.location}</div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div style={{ padding: '12px 16px' }}>
                                        {group.items.map(item => (
                                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                                                <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1F2937' }}>{item.localizedName}</div>
                                                    <div style={{ fontSize: '12px', color: '#6B7280' }}>₹{item.price}/{t('qty_kg')}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden', background: 'white' }}>
                                                    <button onClick={() => item.qty <= item.minOrder ? removeFromCart(item.id) : updateQty(item.id, Math.max(item.minOrder, item.qty - 25))}
                                                        style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', fontWeight: 800, color: '#6B7280' }}>−</button>
                                                    <span style={{ padding: '0 8px', fontWeight: 800, fontSize: '13px', minWidth: '44px', textAlign: 'center' }}>{item.qty}{t('qty_kg')}</span>
                                                    <button onClick={() => updateQty(item.id, item.qty + 25)}
                                                        style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', fontWeight: 800, color: '#2D5016' }}>+</button>
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#166534', minWidth: '64px', textAlign: 'right' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                                            </div>
                                        ))}

                                        {/* Farmer subtotal & WhatsApp */}
                                        <div style={{ paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: '#6B7280' }}>
                                                {t('subtotal')}: <b style={{ color: '#166534' }}>₹{group.items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString('en-IN')}</b>
                                            </span>
                                            <a
                                                href={`https://wa.me/91XXXXXXXXXX?text=${buildWhatsAppMsg(group.items)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#25D366', color: 'white', padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: 800, textDecoration: 'none' }}
                                            >
                                                <span>📱</span> WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer CTA */}
                {cartCount > 0 && (
                    <div style={{ padding: '16px 24px 28px', borderTop: '1px solid #F3F4F6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: 700, color: '#6B7280' }}>{t('grand_total')}</span>
                            <span style={{ fontSize: '24px', fontWeight: 900, color: '#166534' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                            onClick={() => {
                                // Open order flow for all items — use first item as anchor
                                if (cartItems[0]) setOrderItem(cartItems[0]);
                            }}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '16px', border: 'none',
                                background: 'linear-gradient(135deg, #2D5016, #4A8025)',
                                color: 'white', fontSize: '17px', fontWeight: 900, cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(45, 80, 22, 0.4)',
                            }}
                        >
                            ✅ {t('btn_confirm_order')} · ₹{cartTotal.toLocaleString('en-IN')}
                        </button>
                        <button onClick={clearCart} style={{ width: '100%', marginTop: '8px', background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '8px' }}>
                            🗑 {t('cart_clear')}
                        </button>
                    </div>
                )}
            </div>

            {orderItem && (
                <OrderFlow
                    item={orderItem}
                    qty={orderItem.qty}
                    onClose={() => { setOrderItem(null); onClose(); }}
                />
            )}
        </>
    );
}
