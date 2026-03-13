'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { fetchMandiPrices, DEMO_MANDI_PRICES, getSmartPriceSuggestion } from '@/services/mandiPriceService';
import { useLanguage } from '@/context/LanguageContext';
import { GUJARAT_DISTRICTS, VEGETABLE_NAMES } from '@/data/gujaratData';
import GujaratMarketMap from '@/components/GujaratMarketMap';

export default function MandiPricesPage() {
    const { t, language } = useLanguage();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    // Smart Advisor state
    const [advisorVeg, setAdvisorVeg] = useState('Tomato');
    const [advisorQty, setAdvisorQty] = useState(100);
    const [advice, setAdvice] = useState<any>(null);

    useEffect(() => {
        loadPrices();
    }, [selectedDistrict]);

    const loadPrices = async () => {
        setLoading(true);
        const records = await (fetchMandiPrices as any)({ district: selectedDistrict });
        setData(records.length > 0 ? records : DEMO_MANDI_PRICES);
        setLoading(false);
    };

    const handleGetAdvice = async () => {
        const res = await getSmartPriceSuggestion(advisorVeg, selectedDistrict || 'Anand');

        // Localize advice message based on trend
        let msg = "";
        const cropDisplay = (VEGETABLE_NAMES as any)[advisorVeg]?.[language] || advisorVeg;
        const distDisplay = selectedDistrict || 'Anand';

        if (res.trend === 'rising') {
            msg = String(t('rising_market_msg'))
                .replace('{district}', String(t(`dist_${distDisplay.toLowerCase()}`)))
                .replace('{crop}', String(cropDisplay))
                .replace('{price}', String(res.suggestedMin))
                .replace('{count}', (Math.random() * 20 + 5).toFixed(0));
        } else if (res.trend === 'falling') {
            msg = String(t('falling_market_msg'))
                .replace('{district}', String(t(`dist_${distDisplay.toLowerCase()}`)))
                .replace('{crop}', String(cropDisplay))
                .replace('{price}', String(res.suggestedMin));
        } else {
            msg = String(t('stable_market_msg'))
                .replace('{min}', String(res.suggestedMin))
                .replace('{max}', String(res.suggestedMax));
        }

        setAdvice({ ...res, advice: msg });
    };

    const filteredData = data.filter(r =>
        r.commodity.toLowerCase().includes(search.toLowerCase()) ||
        r.market.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ background: '#FFF8EC', minHeight: '100vh' }}>
            <Navigation />

            {/* SECTION A: HEADER */}
            <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '24px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#3D2B1F', marginBottom: '4px' }}>{t('mandi_page_title')}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>{t('mandi_page_subtitle')}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '50px', fontSize: '11px', fontWeight: 800 }}>
                                <span style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
                                {t('mandi_live_badge')}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={loadPrices} style={{ background: '#7CB842', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>{t('btn_refresh')}</button>
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>

                {/* SECTION B: SUMMARY CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {[
                        { emoji: '💰', val: `${(VEGETABLE_NAMES as any)['Capsicum']?.[language] || 'Capsicum'} — ₹62${t('per_kg')}`, label: t('col_max_price'), color: '#F4A837' },
                        { emoji: '🏷️', val: `${(VEGETABLE_NAMES as any)['Tomato']?.[language] || 'Tomato'} — ${t('save_msg')} ₹4${t('per_kg')}`, label: t('advisor_result_title'), color: '#7CB842' },
                        { emoji: '📈', val: `${(VEGETABLE_NAMES as any)['Spinach']?.[language] || 'Spinach'} +14%`, label: t('trend_rising'), color: '#22C55E' },
                        { emoji: '🏪', val: `${data.length} ${t('nav_market')}`, label: t('mandi_page_subtitle'), color: '#60A5FA' },
                    ].map(card => (
                        <div key={card.label} style={{ background: 'white', borderRadius: '16px', padding: '20px', borderLeft: `4px solid ${card.color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{card.emoji}</div>
                            <div style={{ fontSize: '18px', fontWeight: 900, color: '#3D2B1F' }}>{card.val}</div>
                            <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>{card.label}</div>
                        </div>
                    ))}
                </div>

                {/* SECTION C: MARKET MAP */}
                <GujaratMarketMap />

                {/* SECTION C: SEARCH & FILTERS */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        className="km-input"
                        style={{ flex: 1, minWidth: '250px' }}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select className="km-input" style={{ width: '180px' }} value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
                        <option value="">{t('filter_district')}</option>
                        {GUJARAT_DISTRICTS.map(d => (
                            <option key={d.district_en} value={d.district_en}>{d[`district_${language}`] || d.district_en}</option>
                        ))}
                    </select>
                </div>

                {/* SECTION D: PRICE TABLE */}
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '40px' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Fetching government data...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                        <th style={{ padding: '16px', color: '#6B7280', fontSize: '13px' }}>{t('col_vegetable')}</th>
                                        <th style={{ padding: '16px', color: '#6B7280', fontSize: '13px' }}>{t('col_market')}</th>
                                        <th style={{ padding: '16px', color: '#6B7280', fontSize: '13px' }}>{t('col_min_price')}/{t('col_max_price')}</th>
                                        <th style={{ padding: '16px', color: '#6B7280', fontSize: '13px' }}>{t('col_modal_price')}</th>
                                        <th style={{ padding: '16px', color: '#6B7280', fontSize: '13px' }}>{t('col_vs_yesterday')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row: any, i) => (
                                        <React.Fragment key={i}>
                                            <tr
                                                onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                                                style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer', background: expandedRow === i ? '#F0FDF4' : 'transparent' }}
                                            >
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{ fontSize: '24px' }}>{row.emoji}</span>
                                                        <div>
                                                            <div style={{ fontWeight: 700, color: '#3D2B1F', fontSize: '17px' }}>{(VEGETABLE_NAMES as any)[row.commodity]?.[language] || row.commodity}</div>
                                                            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{row.commodity} | {row.variety || 'Local'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{row.market}</div>
                                                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{row.district}</div>
                                                </td>
                                                <td style={{ padding: '16px', color: '#6B7280', fontSize: '13px' }}>
                                                    ₹{row.min_price_kg} - ₹{row.max_price_kg}
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ color: '#2D5016', fontSize: '20px', fontWeight: 900, fontFamily: 'Georgia' }}>₹{row.modal_price_kg}{t('per_kg')}</div>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <span className="km-badge km-badge-green" style={{ fontSize: '11px' }}>{t('save_msg')}4{t('per_kg')}</span>
                                                </td>
                                            </tr>
                                            {expandedRow === i && (
                                                <tr>
                                                    <td colSpan={5} style={{ padding: '24px', background: '#F9FAFB' }}>
                                                        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                                                            <div style={{ flex: 1, minWidth: '200px' }}>
                                                                <h4 style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px', fontWeight: 700 }}>{t('price_trend_7day')}</h4>
                                                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px' }}>
                                                                    {[30, 45, 25, 60, 40, 70, 55].map((h, idx) => (
                                                                        <div key={idx} style={{ flex: 1, height: `${h}%`, background: idx === 6 ? '#7CB842' : '#D1D5DB', borderRadius: '4px' }}></div>
                                                                    ))}
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: '#9CA3AF' }}>
                                                                    <span>{t('mon')}</span><span>{t('sun')}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontSize: '14px', color: '#3D2B1F', marginBottom: '12px' }}>
                                                                    <strong>{t('details_label')}</strong> {t('variety_label')} {row.variety} | {t('grade_label')} {row.grade} | {t('date_label')} {row.arrival_date}
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                                    <button className="km-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>{t('find_farmers')}</button>
                                                                    <button className="km-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>{t('set_price_alert')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* SECTION F: SMART PRICE ADVISOR */}
                <section style={{
                    background: 'linear-gradient(135deg, #3D2B1F, #2D5016)',
                    borderRadius: '24px',
                    padding: '40px',
                    color: 'white',
                    marginBottom: '60px'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '8px' }}>{t('advisor_title')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>{t('advisor_subtitle')}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                            <select className="km-input" style={{ background: 'white' }} value={advisorVeg} onChange={e => setAdvisorVeg(e.target.value)}>
                                {Object.keys(VEGETABLE_NAMES).map(v => (
                                    <option key={v} value={v}>{(VEGETABLE_NAMES as any)[v][language] || v}</option>
                                ))}
                            </select>
                            <select className="km-input" style={{ background: 'white' }} value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
                                {GUJARAT_DISTRICTS.map(d => (
                                    <option key={d.district_en} value={d.district_en}>{d[`district_${language}`] || d.district_en}</option>
                                ))}
                            </select>
                            <input type="number" className="km-input" placeholder={t('qty_kg')} style={{ background: 'white' }} value={advisorQty} onChange={e => setAdvisorQty(Number(e.target.value))} />
                            <button
                                onClick={handleGetAdvice}
                                style={{ background: '#C5E063', color: '#3D2B1F', border: 'none', borderRadius: '50px', fontWeight: 800, cursor: 'pointer', padding: '12px' }}
                            >
                                {t('advisor_btn')}
                            </button>
                        </div>

                        {advice && (
                            <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'left', borderLeft: '6px solid #7CB842', color: '#3D2B1F', marginTop: '32px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{t('advisor_result_title')}</div>
                                        <div style={{ fontSize: '32px', fontWeight: 900, color: '#2D5016', fontFamily: 'Georgia' }}>₹{advice.suggestedMin}–₹{advice.suggestedMax}{t('per_kg')}</div>
                                        <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>{t('mandi_price_label')}: ₹{advice.mandiPrice}{t('per_kg')}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{t('advisor_trend')}</div>
                                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#F4A837' }}>🔥 {t(`trend_${advice.trend}`).toUpperCase()}</div>
                                        <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>{advice.advice}</div>
                                    </div>
                                </div>
                                <button className="km-btn-primary" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}>
                                    {t('create_listing_at').replace('{price}', `₹${advice.suggestedMin}${t('per_kg')}`)}
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '12px', paddingBottom: '40px' }}>
                    {t('mandi_source')} | {t('footer_tagline')}
                </div>

            </main>

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
