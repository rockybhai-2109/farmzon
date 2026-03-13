'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MandiPriceWidget from '@/components/MandiPriceWidget';
import { useLanguage } from '@/context/LanguageContext';
import { VEGETABLE_NAMES } from '@/data/gujaratData';
import { motion } from 'framer-motion';
import LocationStrip from '@/components/location/LocationStrip';

const farmers = [
  {
    id: 1, emoji: '🧑‍🌾', name: 'Rajesh Patel', farm: 'Green Earth Farm',
    location: 'Anand, Gujarat', rating: 4.8, reviews: 124,
    badge: 'Top Seller', badgeClass: 'km-badge-gold', crops: ['🍅 Tomatoes', '🍆 Brinjal', '🫑 Okra', '🥬 Spinach'],
    totalSold: '48,000 kg',
  },
  {
    id: 2, emoji: '👩‍🌾', name: 'Sunita Devi', farm: 'Sunrise Organic Farm',
    location: 'Vadodara, Gujarat', rating: 4.6, reviews: 89,
    badge: 'Certified Organic', badgeClass: 'km-badge-green', crops: ['🥬 Spinach', '🌿 Coriander', '🥦 Cabbage'],
    totalSold: '31,000 kg',
  },
  {
    id: 3, emoji: '🧑‍🌾', name: 'Vijay Kumar', farm: 'Valley Fresh Farm',
    location: 'Mehsana, Gujarat', rating: 4.9, reviews: 201,
    badge: 'Premium Farmer', badgeClass: 'km-badge-purple', crops: ['🫑 Capsicum', '🥒 Cucumber', '🥬 Bitter Gourd'],
    totalSold: '92,000 kg',
  },
];

const features = (t: any) => [
  { emoji: '✅', title: t('feat_verified_title'), desc: t('feat_verified_desc'), bg: '#E8F5E9' },
  { emoji: '💰', title: t('feat_price_title'), desc: t('feat_price_desc'), bg: '#FFF3E0' },
  { emoji: '📦', title: t('feat_bulk_title'), desc: t('feat_bulk_desc'), bg: '#E3F2FD' },
  { emoji: '🚚', title: t('feat_transport_title'), desc: t('feat_transport_desc'), bg: '#E8F5E9' },
  { emoji: '📊', title: t('feat_data_title'), desc: t('feat_data_desc'), bg: '#FFF3E0' },
  { emoji: '💬', title: t('feat_direct_title'), desc: t('feat_direct_desc'), bg: '#E3F2FD' },
];

const quickSearch = [
  { emoji: '🍅', label: 'Tomato' },
  { emoji: '🥬', label: 'Spinach' },
  { emoji: '🫑', label: 'Capsicum' },
  { emoji: '🧅', label: 'Onion' },
  { emoji: '🥒', label: 'Cucumber' },
  { emoji: '🌿', label: 'Coriander' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ fontSize: '14px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#F59E0B' : '#D1D5DB' }}>★</span>
      ))}
    </span>
  );
}

export default function HomePage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />

      {/* === HERO SECTION === */}
      <section style={{
        background: 'linear-gradient(135deg, #3D2B1F 0%, #2D5016 50%, #4A7C28 100%)',
        padding: '60px 20px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(197,224,99,0.06)' }} />

        <div className="max-w-[700px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '400px', margin: '0 auto 24px' }}
          >
            <LocationStrip />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 6vw, 48px)', color: 'white', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px' }}
          >
            {t('hero_headline')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '36px', lineHeight: 1.6 }}
          >
            {t('hero_subheadline')}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: 'flex', background: 'white', borderRadius: '50px', padding: '6px 6px 6px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', maxWidth: '560px', margin: '0 auto 24px', alignItems: 'center', gap: '8px' }}
          >
            <span style={{ fontSize: '18px' }}>🔍</span>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', background: 'transparent', fontFamily: 'inherit' }}
            />
            <button className="km-btn-primary" style={{ padding: '12px 24px', borderRadius: '50px', whiteSpace: 'nowrap' }}>
              {t('btn_search')}
            </button>
          </motion.div>

          {/* Quick Search Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {quickSearch.map(item => (
              <Link key={item.label} href={`/market?q=${item.label}`} style={{
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
                {item.emoji} {(VEGETABLE_NAMES as any)[item.label]?.[language] || item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MandiPriceWidget />

      {/* === STATS BAR === */}
      <section style={{ background: '#F4A837', padding: '20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
          {[
            { num: '2,400+', label: t('stats_farmers') },
            { num: '18,000+', label: t('stats_listed') },
            { num: '45+', label: t('stats_cities') },
            { num: '1,200+', label: t('stats_buyers') },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 900, color: '#3D2B1F', fontFamily: 'Georgia, serif' }}>{s.num}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#5A3E2E', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* === WHY KISANMART === */}
      <section style={{ padding: '60px 20px', background: '#FFF8EC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 32px)', color: '#3D2B1F', marginBottom: '8px' }}>{t('why_title')}</h2>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>{t('why_subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {features(t).map(f => (
              <div key={f.title} className="km-card" style={{ padding: '24px', background: f.bg }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{f.emoji}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#3D2B1F', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === TOP FARMERS === */}
      <section style={{ padding: '60px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 4vw, 28px)', color: '#3D2B1F' }}>{t('top_farmers_title')}</h2>
            <Link href="/farmers" style={{ color: '#2D5016', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>{t('view_all')}</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {farmers.map((farmer, idx) => (
              <motion.div
                key={farmer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/farmers/${farmer.id}`} style={{ textDecoration: 'none' }}>
                  <div className="km-card" style={{ padding: '24px', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center text-3xl flex-shrink-0 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                        {farmer.emoji}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 900, color: 'var(--foreground)', fontSize: '17px' }}>{farmer.name}</span>
                          <span style={{ color: '#3B82F6', fontSize: '16px' }}>✅</span>
                          <span className={`km-badge ${farmer.badgeClass}`}>{farmer.badge}</span>
                        </div>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{farmer.farm}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                      <span className="text-xs">📍 {farmer.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                      <StarRating rating={farmer.rating} />
                      <span style={{ fontWeight: 900, fontSize: '14px', color: 'var(--foreground)' }}>{farmer.rating}</span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">({farmer.reviews} reviews)</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      {farmer.crops.map(c => {
                        const cropClean = c.split(' ').slice(1).join(' ');
                        const emoji = c.split(' ')[0];
                        return <span key={c} className="bg-primary/5 text-primary border border-primary/10 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-primary/10">{emoji} {(VEGETABLE_NAMES as any)[cropClean]?.[language] || cropClean}</span>
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="km-btn-whatsapp glass hover:bg-green-500/10" style={{ border: 'none' }}>{t('btn_whatsapp')}</button>
                      <button className="km-btn-call" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>{t('btn_call')}</button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section style={{ padding: '60px 20px', background: '#FFF8EC' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 4vw, 28px)', textAlign: 'center', color: '#3D2B1F', marginBottom: '40px' }}>
            {t('how_title')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { step: '1', title: t('step1_title'), desc: t('step1_desc') },
              { step: '2', title: t('step2_title'), desc: t('step2_desc') },
              { step: '3', title: t('step3_title'), desc: t('step3_desc') },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2D5016, #7CB842)',
                  color: 'white', fontSize: '24px', fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontFamily: 'Georgia, serif',
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontWeight: 700, color: '#3D2B1F', marginBottom: '8px', fontSize: '17px' }}>{s.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section style={{
        background: 'linear-gradient(135deg, #2D5016, #7CB842)',
        padding: '60px 20px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 36px)', color: 'white', marginBottom: '12px' }}>
          {language === 'gu' ? 'શું તમે ખેડૂત છો? અમારી સાથે મફતમાં જોડાઓ.' : language === 'hi' ? 'क्या आप किसान हैं? हमसे मुफ्त में जुड़ें।' : 'Are you a farmer? Join us free.'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '32px' }}>
          {language === 'gu' ? '૧,૨૦૦+ ખરીદદારોને તમારા શાકભાજી વેચવાનું શરૂ કરો.' : language === 'hi' ? '1,200+ खरीदारों को अपनी सब्ज़ियाँ बेचना शुरू करें।' : 'Start selling your organic vegetables to 1,200+ buyers today.'}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register/farmer">
            <button style={{
              background: '#C5E063', color: '#3D2B1F', border: 'none',
              borderRadius: '50px', padding: '16px 32px', fontWeight: 800,
              fontSize: '16px', cursor: 'pointer', minHeight: '52px',
            }}>
              {t('cta_farmer')}
            </button>
          </Link>
          <Link href="/register/buyer">
            <button style={{
              background: 'transparent', color: 'white',
              border: '2px solid white', borderRadius: '50px', padding: '16px 32px',
              fontWeight: 800, fontSize: '16px', cursor: 'pointer', minHeight: '52px',
            }}>
              {t('cta_buyer')}
            </button>
          </Link>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer style={{ background: '#3D2B1F', color: '#D1D5DB', padding: '48px 20px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>🌱</span>
                <div>
                  <div style={{ fontFamily: 'Georgia, serif', color: '#C5E063', fontSize: '20px', fontWeight: 700 }}>KisanMart</div>
                  <div style={{ color: '#F4A837', fontSize: '9px', letterSpacing: '2px', fontWeight: 600 }}>WHOLESALE ORGANIC</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#9CA3AF' }}>Farm Fresh. Direct. No Middlemen.</p>
            </div>

            {[
              { title: 'For Farmers', links: [['Register as Farmer', '/register/farmer'], ['Farmer Dashboard', '/dashboard/farmer'], ['Post Produce', '/market']] },
              { title: 'For Buyers', links: [['Browse Market', '/market'], ['View Prices', '/prices'], ['Register Business', '/register/buyer']] },
              { title: 'Platform', links: [['All Farmers', '/farmers'], ['Transport Board', '/transport'], ['Admin Panel', '/admin']] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '14px', fontSize: '15px' }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C5E063')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
            © {new Date().getFullYear()} KisanMart. All rights reserved. · {t('footer_tagline')}
          </div>
        </div>
      </footer>
    </div>
  );
}
