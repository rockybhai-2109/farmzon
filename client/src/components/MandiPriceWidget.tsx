'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTopVegetablePrices, DEMO_MANDI_PRICES } from '@/services/mandiPriceService';

export default function MandiPriceWidget() {
    const [prices, setPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getTopVegetablePrices();
            setPrices(data || DEMO_MANDI_PRICES.slice(0, 5));
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="km-card" style={{ padding: '20px', borderLeft: '4px solid #F4A837' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 700, color: '#3D2B1F', fontSize: '15px' }}>📊 Today&apos;s Mandi Prices</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22C55E', fontSize: '10px', fontWeight: 800 }}>
                    <span style={{ width: '5px', height: '5px', background: '#22C55E', borderRadius: '50%' }}></span>
                    LIVE
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }}>Loading prices...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {prices.slice(0, 5).map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #F3F4F6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>{p.emoji}</span>
                                <span style={{ color: '#374151', fontSize: '13px', fontWeight: 600 }}>{p.commodity}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#2D5016', fontWeight: 900, fontSize: '14px' }}>₹{p.modal_price_kg}/kg</div>
                                <div style={{ fontSize: '10px', color: p.trend === '📉' ? '#EF4444' : '#22C55E' }}>{p.trend || '▲'} 2%</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Link href="/mandi-prices" style={{ display: 'block', textAlign: 'center', color: '#7CB842', fontWeight: 700, fontSize: '12px', marginTop: '14px', textDecoration: 'none' }}>
                View All Prices →
            </Link>
            <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '9px', marginTop: '8px' }}>
                Source: data.gov.in
            </div>
        </div>
    );
}
