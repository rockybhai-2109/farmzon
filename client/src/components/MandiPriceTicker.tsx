'use client';

import React, { useEffect, useState } from 'react';
import { getTopVegetablePrices, DEMO_MANDI_PRICES } from '@/services/mandiPriceService';
import { useLanguage } from '@/context/LanguageContext';
import { VEGETABLE_NAMES } from '@/data/gujaratData';

interface PriceItem {
    commodity: string;
    modal_price_kg: string;
    trend: string;
    emoji: string;
}

export default function MandiPriceTicker() {
    const { t, language } = useLanguage();
    const [prices, setPrices] = useState<PriceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getTopVegetablePrices();
            setPrices(data || DEMO_MANDI_PRICES);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <div style={{ height: '44px', background: '#3D2B1F' }} />;

    return (
        <div style={{
            width: '100%',
            background: '#3D2B1F',
            height: '44px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            position: 'relative'
        }}>
            <div style={{
                flexShrink: 0,
                background: '#3D2B1F',
                padding: '0 20px',
                zIndex: 2,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                borderRight: '1px solid rgba(255,255,255,0.1)'
            }}>
                <span style={{ color: '#C5E063', fontSize: '11px', fontWeight: 900, letterSpacing: '2px' }}>{t('ticker_label').toUpperCase()}</span>
            </div>

            <div className="ticker-wrapper" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                <div className="ticker-content" style={{
                    display: 'flex',
                    gap: '40px',
                    paddingLeft: '20px',
                    animation: 'marquee 30s linear infinite'
                }}>
                    {prices.concat(prices).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '14px', fontWeight: 700 }}>
                            <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                            <span>{(VEGETABLE_NAMES as Record<string, any>)[item.commodity]?.[language] || item.commodity}</span>
                            <span style={{ color: '#C5E063' }}>₹{item.modal_price_kg}{t('per_kg')}</span>
                            <span style={{ fontSize: '12px' }}>{item.trend === '📈' ? '▲' : item.trend === '📉' ? '▼' : '▶'}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                marginLeft: 'auto',
                background: '#3D2B1F',
                padding: '0 15px',
                zIndex: 2,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '10px',
                fontWeight: 600
            }}>
                {t('mandi_source')}
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-wrapper:hover .ticker-content {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
}
