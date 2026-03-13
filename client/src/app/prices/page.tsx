'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';

const priceData = [
    { name: 'Tomato', emoji: '🍅', mandi: 26, farm: 28, trend: '📈', change: '+8%', demand: 85 },
    { name: 'Onion', emoji: '🧅', mandi: 22, farm: 19, trend: '📉', change: '-5%', demand: 65 },
    { name: 'Potato', emoji: '🥔', mandi: 18, farm: 16, trend: '➡️', change: '0%', demand: 70 },
    { name: 'Capsicum', emoji: '🫑', mandi: 60, farm: 55, trend: '📈', change: '+12%', demand: 90 },
    { name: 'Spinach', emoji: '🥬', mandi: 20, farm: 18, trend: '📈', change: '+6%', demand: 75 },
    { name: 'Okra', emoji: '🫑', mandi: 38, farm: 35, trend: '➡️', change: '0%', demand: 60 },
    { name: 'Brinjal', emoji: '🍆', mandi: 24, farm: 22, trend: '📉', change: '-3%', demand: 55 },
    { name: 'Cucumber', emoji: '🥒', mandi: 22, farm: 20, trend: '📉', change: '-5%', demand: 50 },
    { name: 'Coriander', emoji: '🌿', mandi: 50, farm: 45, trend: '📈', change: '+10%', demand: 80 },
    { name: 'Bitter Gourd', emoji: '🥬', mandi: 42, farm: 40, trend: '➡️', change: '+2%', demand: 45 },
];

const vegetables = priceData.map(p => p.name);
const districts = ['Select District', 'Ahmedabad', 'Anand', 'Surat', 'Vadodara', 'Mehsana', 'Rajkot'];

export default function PricesPage() {
    const [veggie, setVeggie] = useState('');
    const [quantity, setQuantity] = useState('');
    const [district, setDistrict] = useState('');
    const [suggestion, setSuggestion] = useState<null | { low: number, high: number, recommended: number, margin: number, vegName: string }>(null);

    const handleSuggest = () => {
        if (!veggie) return;
        const found = priceData.find(p => p.name === veggie);
        if (found) {
            const low = Math.round(found.farm * 0.95);
            const high = Math.round(found.farm * 1.15);
            const recommended = Math.round(found.farm * 1.05);
            const margin = Math.round(((recommended - found.mandi) / found.mandi) * 100);
            setSuggestion({ low, high, recommended, margin, vegName: veggie });
        }
    };

    return (
        <div>
            <Navigation />
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 4vw, 30px)', color: '#3D2B1F' }}>📊 Live Market Intelligence</h1>
                    <span style={{ background: '#DCFCE7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#22C55E', fontSize: '10px' }}>●</span> LIVE
                    </span>
                </div>
                <p style={{ color: '#6B7280', marginBottom: '36px', fontSize: '14px' }}>
                    Today's mandi prices vs. KisanMart farm prices — updated every 2 hours
                </p>

                {/* Price Comparison Table */}
                <div className="km-card" style={{ overflow: 'auto', marginBottom: '40px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ background: '#3D2B1F' }}>
                                {['Vegetable', 'Mandi ₹/kg', 'KisanMart ₹/kg', 'Your Savings', '7-Day Trend'].map(h => (
                                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#C5E063', fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {priceData.map((row, i) => {
                                const savings = row.mandi - row.farm;
                                const savingsPct = Math.round((savings / row.mandi) * 100);
                                return (
                                    <tr key={row.name} style={{ background: i % 2 === 0 ? 'white' : '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ fontSize: '20px', marginRight: '8px' }}>{row.emoji}</span>
                                            <span style={{ fontWeight: 600, color: '#3D2B1F' }}>{row.name}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#6B7280', fontWeight: 600 }}>₹{row.mandi}</td>
                                        <td style={{ padding: '14px 16px', color: '#2D5016', fontWeight: 700 }}>₹{row.farm}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                color: savings >= 0 ? '#166534' : '#991B1B',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                            }}>
                                                {savings >= 0 ? `+₹${savings}/kg` : `-₹${Math.abs(savings)}/kg`}
                                                <span style={{ fontSize: '12px', marginLeft: '4px', opacity: 0.8 }}>({savingsPct}%)</span>
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ fontSize: '16px', marginRight: '4px' }}>{row.trend}</span>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: row.change.startsWith('+') ? '#166534' : row.change === '0%' ? '#6B7280' : '#991B1B' }}>
                                                {row.change}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Demand Indicators */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#3D2B1F', marginBottom: '20px' }}>🔥 Trending Demand This Week</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                        {priceData.map(row => {
                            const barColor = row.demand >= 80 ? '#7CB842' : row.demand >= 60 ? '#F4A837' : '#9CA3AF';
                            return (
                                <div key={row.name} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', border: '1px solid #E5E7EB' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 600, color: '#3D2B1F', fontSize: '14px' }}>{row.emoji} {row.name}</span>
                                        <span style={{ fontWeight: 700, fontSize: '14px', color: barColor }}>{row.demand}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${row.demand}%`, background: barColor, borderRadius: '4px', transition: 'width 0.5s' }} />
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                                        {row.demand >= 80 ? '🔥 High Demand' : row.demand >= 60 ? '📊 Medium Demand' : '📉 Low Demand'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Smart Price Suggester */}
                <div style={{ background: 'linear-gradient(135deg, #3D2B1F, #2D5016)', borderRadius: '20px', padding: '32px' }}>
                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: 'white', marginBottom: '8px' }}>🤖 Smart Price Suggester for Farmers</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px' }}>
                        Enter your vegetable and we suggest the best selling price
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ color: '#C5E063', fontSize: '12px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>VEGETABLE</label>
                            <select className="km-select" value={veggie} onChange={e => setVeggie(e.target.value)}>
                                <option value="">Select Vegetable</option>
                                {vegetables.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ color: '#C5E063', fontSize: '12px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>QUANTITY (KG)</label>
                            <input className="km-input" type="number" placeholder="e.g. 500" value={quantity} onChange={e => setQuantity(e.target.value)} />
                        </div>
                        <div>
                            <label style={{ color: '#C5E063', fontSize: '12px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>YOUR DISTRICT</label>
                            <select className="km-select" value={district} onChange={e => setDistrict(e.target.value)}>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                    <button className="km-btn-primary" onClick={handleSuggest} style={{ background: '#C5E063', color: '#3D2B1F' }}>
                        Get Price Suggestion
                    </button>

                    {suggestion && (
                        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(197,224,99,0.3)' }}>
                            <div style={{ fontSize: '20px', marginBottom: '8px' }}>💡</div>
                            <p style={{ color: '#C5E063', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
                                Suggested: ₹{suggestion.low}–₹{suggestion.high}/kg for {suggestion.vegName}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>
                                Mandi demand is currently high. List at <strong style={{ color: '#C5E063' }}>₹{suggestion.recommended}</strong> for best-seller visibility.
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                Expected margin vs mandi: <strong style={{ color: '#7CB842' }}>+{Math.abs(suggestion.margin)}%</strong>
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
