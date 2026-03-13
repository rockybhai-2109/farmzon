'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useLanguage } from '@/context/LanguageContext';

const getManagerMetrics = (t: any) => [
    { emoji: '🌾', label: t('admin_metric_farmers'), value: '2,412', change: `+48 ${t('admin_status_this_month')}`, color: '#166534', bg: '#DCFCE7' },
    { emoji: '⏳', label: t('admin_metric_pending'), value: '23', change: t('admin_status_action'), color: '#92400E', bg: '#FEF3C7', urgent: true },
    { emoji: '🛒', label: t('admin_metric_buyers'), value: '1,287', change: `+120 ${t('admin_status_this_month')}`, color: '#1E40AF', bg: '#DBEAFE' },
    { emoji: '📦', label: t('admin_metric_orders'), value: '347', change: `₹2.4L ${t('admin_status_revenue')}`, color: '#5B21B6', bg: '#EDE9FE' },
    { emoji: '🚩', label: t('admin_metric_flagged'), value: '5', change: t('admin_status_review'), color: '#991B1B', bg: '#FEE2E2', urgent: true },
    { emoji: '💰', label: t('admin_metric_revenue'), value: '₹1.2L', change: t('admin_status_this_month'), color: '#0F766E', bg: '#CCFBF1' },
];

const getPendingFarmers = (t: any) => [
    { name: 'Bhavesh Patel', location: `Surat, ${t('filter_district')}`, applied: `2 ${t('admin_status_hours')}`, docs: '3/3' },
    { name: 'Kamla Bai', location: `Junagadh, ${t('filter_district')}`, applied: `5 ${t('admin_status_hours')}`, docs: '2/3' },
    { name: 'Raju Yadav', location: `Ahmedabad, ${t('filter_district')}`, applied: `8 ${t('admin_status_hours')}`, docs: '3/3' },
    { name: 'Deepak Sharma', location: `Rajkot, ${t('filter_district')}`, applied: t('admin_status_yesterday'), docs: '3/3' },
];

const getHealthMetrics = (t: any) => [
    { label: t('admin_health_uptime'), value: '99.8%', color: '#166534' },
    { label: t('admin_health_load'), value: '1.2s', color: '#1E40AF' },
    { label: t('admin_health_mobile'), value: '78%', color: '#5B21B6' },
    { label: t('admin_health_success'), value: '96.5%', color: '#0F766E' },
];

const getQuickActions = (t: any) => [
    { emoji: '📢', label: t('admin_act_announce'), color: '#2D5016', bg: '#DCFCE7' },
    { emoji: '📊', label: t('admin_act_export'), color: '#1E40AF', bg: '#DBEAFE' },
    { emoji: '🏅', label: t('admin_act_badges'), color: '#5B21B6', bg: '#EDE9FE' },
    { emoji: '🚩', label: t('admin_act_flagged'), color: '#991B1B', bg: '#FEE2E2' },
    { emoji: '📈', label: t('admin_act_alert'), color: '#92400E', bg: '#FEF3C7' },
];

export default function AdminDashboard() {
    const { t } = useLanguage();
    const [pendingList, setPendingList] = useState(getPendingFarmers(t));
    const [activeTab, setActiveTab] = useState(0);

    const handleAction = (name: string, action: string) => {
        setPendingList(prev => prev.filter(f => f.name !== name));
        alert(`${action}: ${name}`);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F1F5F9' }}>
            <Navigation />

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>{t('admin_platform')}</div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 4vw, 30px)', color: '#F1F5F9' }}>{t('admin_panel')}</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
                    {getManagerMetrics(t).map(m => (
                        <div key={m.label} style={{ background: '#1E293B', borderRadius: '14px', padding: '20px', border: m.urgent ? `1px solid ${m.color}40` : '1px solid #334155', boxShadow: m.urgent ? `0 0 20px ${m.color}20` : 'none' }}>
                            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{m.emoji}</div>
                            <div style={{ fontSize: '26px', fontWeight: 900, color: m.color, fontFamily: 'Georgia, serif' }}>{m.value}</div>
                            <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '4px', fontWeight: 600 }}>{m.label}</div>
                            <div style={{ color: m.urgent ? m.color : '#64748B', fontSize: '12px', marginTop: '4px' }}>{m.change}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', borderBottom: '1px solid #334155', marginBottom: '28px', gap: '0', overflowX: 'auto' }}>
                    {[t('admin_tab_pending'), t('admin_tab_health'), t('admin_tab_actions'), t('admin_tab_api')].map((tab, i) => (
                        <button key={tab} onClick={() => setActiveTab(i)} style={{
                            padding: '14px 20px', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer',
                            background: 'none', whiteSpace: 'nowrap',
                            color: activeTab === i ? '#7CB842' : '#64748B',
                            borderBottom: `2px solid ${activeTab === i ? '#7CB842' : 'transparent'}`,
                            position: 'relative',
                        }}>
                            {i === 0 && pendingList.length > 0 && (
                                <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#F4A837', color: '#3D2B1F', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {pendingList.length}
                                </span>
                            )}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab 1: Pending Verifications */}
                {activeTab === 0 && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: '#1E293B' }}>
                                    {[t('admin_col_name'), t('admin_col_location'), t('admin_col_applied'), t('admin_col_docs'), t('admin_col_actions')].map(h => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#94A3B8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pendingList.map((farmer, i) => (
                                    <tr key={farmer.name} style={{ background: i % 2 === 0 ? '#1E293B' : '#0F172A', borderBottom: '1px solid #334155' }}>
                                        <td style={{ padding: '16px', fontWeight: 700, color: '#F1F5F9' }}>{farmer.name}</td>
                                        <td style={{ padding: '16px', color: '#94A3B8', fontSize: '14px' }}>📍 {farmer.location}</td>
                                        <td style={{ padding: '16px', color: '#64748B', fontSize: '14px' }}>{farmer.applied}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ background: farmer.docs === '3/3' ? '#DCFCE7' : '#FEF3C7', color: farmer.docs === '3/3' ? '#166534' : '#92400E', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                                                📄 {farmer.docs} docs
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <button onClick={() => handleAction(farmer.name, 'Approved')} style={{ background: '#DCFCE7', color: '#166534', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>✅ {t('admin_btn_approve')}</button>
                                                <button onClick={() => handleAction(farmer.name, 'Rejected')} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>✗ {t('admin_btn_reject')}</button>
                                                <button style={{ background: '#DBEAFE', color: '#1E40AF', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>👁 {t('admin_btn_review')}</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pendingList.length === 0 && (
                                    <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>{t('admin_all_reviewed')}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab 2: Platform Health */}
                {activeTab === 1 && (
                    <div className="km-card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {getHealthMetrics(t).map(m => (
                                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#0F172A', borderRadius: '10px' }}>
                                    <span style={{ color: '#94A3B8', fontWeight: 600 }}>{m.label}</span>
                                    <span style={{ color: m.color, fontWeight: 900, fontSize: '20px', fontFamily: 'Georgia' }}>{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 3: Quick Actions */}
                {activeTab === 2 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                        {getQuickActions(t).map(action => (
                            <button key={action.label} onClick={() => alert(`Action: ${action.label}`)} style={{
                                padding: '20px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                                background: action.bg, textAlign: 'center', fontWeight: 700,
                                color: action.color, fontSize: '14px',
                            }}>
                                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{action.emoji}</div>
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Tab 4: Crop Images */}
                {activeTab === 3 && (
                    <div style={{ maxWidth: '800px' }}>
                        <div className="km-card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '24px' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', marginBottom: '20px' }}>🖼️ {t('admin_act_badges')} (Manage Images)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                                {['Tomato', 'Onion', 'Potato', 'Brinjal', 'Lady Finger'].map(crop => (
                                    <div key={crop} style={{ background: '#0F172A', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                                        <div style={{ width: '80px', height: '80px', background: '#334155', borderRadius: '12px', margin: '0 auto 12px', overflow: 'hidden' }}>
                                            <img src={`/images/vegetables/${crop.toLowerCase().replace(' ', '-')}.jpg`} alt={crop} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>{crop}</div>
                                        <button style={{ background: '#7CB842', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>બદલો (Change)</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 5: API Settings */}
                {activeTab === 4 && (
                    <div style={{ maxWidth: '600px' }}>
                        <div className="km-card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '32px' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', marginBottom: '24px' }}>{t('admin_api_config')}</h3>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '1px', marginBottom: '8px' }}>{t('admin_api_key_label')}</label>
                                <input type="password" defaultValue="579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b" style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px' }} />
                                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>{t('admin_api_desc')}</p>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '1px', marginBottom: '8px' }}>{t('admin_api_ttl')}</label>
                                <select style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px' }}>
                                    <option>{t('hours_2_rec')}</option>
                                    <option>{t('hours_4')}</option>
                                    <option>{t('hours_12')}</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="km-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{t('admin_api_save')}</button>
                                <button style={{ background: 'transparent', border: '1px solid #334155', color: '#94A3B8', borderRadius: '50px', padding: '0 20px', fontWeight: 700, cursor: 'pointer' }}>{t('admin_api_test')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
