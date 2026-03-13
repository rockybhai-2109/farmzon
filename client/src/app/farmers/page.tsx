'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useLanguage } from '@/context/LanguageContext';
import { VEGETABLE_NAMES } from '@/data/gujaratData';

const allFarmers = [
    {
        id: 1, image: '/images/farmers/rajesh.jpg', name: 'Rajesh Patel', farm: 'Green Earth Farm',
        location: 'Anand, Gujarat', rating: 4.8, reviews: 124,
        badge: '🏆 Top Seller', badgeClass: 'km-badge-gold',
        crops: ['🍅 Tomatoes', '🍆 Brinjal', '🫑 Okra', '🥬 Spinach'],
        phone: '+91 98765 43210', totalSold: '48,000 kg', joined: '2022',
        story: 'Third-generation organic farmer.',
    },
    {
        id: 2, image: '/images/farmers/sunita.jpg', name: 'Sunita Devi', farm: 'Sunrise Organic Farm',
        location: 'Vadodara, Gujarat', rating: 4.6, reviews: 89,
        badge: '🌿 Certified Organic', badgeClass: 'km-badge-green',
        crops: ['🥬 Spinach', '🌿 Coriander', '🥦 Cabbage'],
        phone: '+91 98765 43211', totalSold: '31,000 kg', joined: '2023',
        story: 'Pioneering woman farmer using natural pest control.',
    },
    {
        id: 3, image: '/images/farmers/vijay.jpg', name: 'Vijay Kumar', farm: 'Valley Fresh Farm',
        location: 'Mehsana, Gujarat', rating: 4.9, reviews: 201,
        badge: '⭐ Premium Farmer', badgeClass: 'km-badge-purple',
        crops: ['🫑 Capsicum', '🥒 Cucumber', '🥬 Bitter Gourd'],
        phone: '+91 98765 43212', totalSold: '92,000 kg', joined: '2021',
        story: 'Export-quality vegetables since 2018.',
    },
    {
        id: 4, image: '/images/farmers/atul.jpg', name: 'Atulbhai Shah', farm: 'Saurashtra Farms',
        location: 'Junagadh, Gujarat', rating: 4.5, reviews: 67,
        badge: '🆕 New Farmer', badgeClass: 'km-badge-gray',
        crops: ['🥜 Peanuts', '🌽 Corn', '🧅 Onion'],
        phone: '+91 98765 43213', totalSold: '12,000 kg', joined: '2024',
        story: 'Fresh from the fields of Saurashtra.',
    },
    {
        id: 5, image: '/images/farmers/meena.jpg', name: 'Meena Prajapati', farm: 'Sabarmati Organic',
        location: 'Gandhinagar, Gujarat', rating: 4.7, reviews: 143,
        badge: '🏆 Top Seller', badgeClass: 'km-badge-gold',
        crops: ['🥕 Carrots', '🥬 Fenugreek', '🌿 Mint'],
        phone: '+91 98765 43214', totalSold: '38,000 kg', joined: '2022',
        story: 'Supplying organic produce to top city hotels.',
    },
    {
        id: 6, image: '/images/farmers/dinesh.jpg', name: 'Dinesh Baraiya', farm: 'Kutch Desert Farm',
        location: 'Bhuj, Gujarat', rating: 4.4, reviews: 56,
        badge: '🌿 Certified Organic', badgeClass: 'km-badge-green',
        crops: ['🥒 Cucumber', '🍅 Tomatoes', '🥔 Potato'],
        phone: '+91 98765 43215', totalSold: '22,000 kg', joined: '2023',
        story: 'Innovative desert farming techniques.',
    },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <span>
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ color: i <= Math.round(rating) ? '#F59E0B' : '#D1D5DB', fontSize: '14px' }}>★</span>
            ))}
        </span>
    );
}

function FarmerCard({ farmer }: { farmer: typeof allFarmers[0] }) {
    const { t, language } = useLanguage();
    return (
        <div className="km-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    overflow: 'hidden', flexShrink: 0,
                    border: '2px solid #E8F5E9'
                }}>
                    <img src={farmer.image} alt={farmer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#3D2B1F', fontSize: '16px' }}>{farmer.name}</span>
                        <span style={{ fontSize: '15px', color: '#3B82F6' }}>✅</span>
                        <span className={`km-badge ${farmer.badgeClass}`}>{farmer.badge}</span>
                    </div>
                    <div style={{ color: '#9CA3AF', fontSize: '13px' }}>{farmer.farm}</div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px' }}>📍</span>
                <span style={{ color: '#6B7280', fontSize: '13px' }}>{farmer.location}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <StarRating rating={farmer.rating} />
                <span style={{ fontWeight: 700, color: '#3D2B1F', fontSize: '14px' }}>{farmer.rating}</span>
                <span style={{ color: '#9CA3AF', fontSize: '13px' }}>({farmer.reviews} {t('reviews')})</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {farmer.crops.map(c => {
                    const cropClean = c.split(' ').slice(1).join(' ');
                    const emoji = c.split(' ')[0];
                    return <span key={c} style={{ background: '#E8F5E9', color: '#2D5016', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{emoji} {(VEGETABLE_NAMES as any)[cropClean]?.[language] || cropClean}</span>
                })}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <a href={`https://wa.me/${farmer.phone.replace(/\s/g, '')}`} className="km-btn-whatsapp" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>📱 {t('btn_whatsapp')}</a>
                <a href={`tel:${farmer.phone}`} className="km-btn-call" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>📞 {t('btn_call')}</a>
            </div>

            <Link href={`/farmers/${farmer.id}`} style={{ display: 'block', textAlign: 'center', color: '#2D5016', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                {language === 'gu' ? 'પ્રોફાઇલ જુઓ →' : language === 'hi' ? 'प्रोफ़ाइल देखें →' : 'View Full Profile →'}
            </Link>
        </div>
    );
}

export default function FarmersPage() {
    const { t, language } = useLanguage();
    const [search, setSearch] = useState('');

    const filtered = allFarmers.filter(f =>
        search === '' ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.location.toLowerCase().includes(search.toLowerCase()) ||
        f.crops.some(c => c.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <Navigation />
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
                {/* Header */}
                <div style={{ marginBottom: '28px' }}>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 32px)', color: '#3D2B1F' }}>🌾 {t('top_farmers_title')}</h1>
                    <p style={{ color: '#6B7280', marginTop: '4px' }}>{t('feat_verified_desc')}</p>
                </div>

                {/* Search + Filters */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
                        <input
                            className="km-input"
                            style={{ paddingLeft: '40px' }}
                            placeholder={t('search_placeholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="km-select" style={{ width: 'auto', minWidth: '140px' }}>
                        <option>District: All</option>
                        <option>Anand</option>
                        <option>Vadodara</option>
                        <option>Mehsana</option>
                        <option>Gandhinagar</option>
                    </select>
                    <select className="km-select" style={{ width: 'auto', minWidth: '140px' }}>
                        <option>Sort: Top Rated</option>
                        <option>Newest First</option>
                        <option>Most Active</option>
                    </select>
                </div>

                {/* Results count */}
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
                    Showing {filtered.length} of {allFarmers.length} farmers
                </p>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {filtered.map(f => <FarmerCard key={f.id} farmer={f} />)}
                </div>

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌾</div>
                        <p style={{ fontSize: '18px', fontWeight: 600 }}>No farmers found</p>
                        <p style={{ fontSize: '14px' }}>Try a different search term</p>
                    </div>
                )}
            </main>
        </div>
    );
}
