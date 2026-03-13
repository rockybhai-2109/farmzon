'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useLanguage } from '@/context/LanguageContext';

interface Trip {
    id: number;
    vehicleType: string;
    driverName: string;
    contact: string;
    fromDistrict: string;
    toDistrict: string;
    totalCapacity: string;
    availableSpace: string;
    departureTime: string;
    pricePerKg: string;
    verified: boolean;
}

const INITIAL_TRIPS: Trip[] = [
    { id: 1, vehicleType: 'Eicher 14ft', driverName: 'Mohit Bhai', contact: '91xxxxxxxxxx', fromDistrict: 'Anand', toDistrict: 'Ahmedabad', totalCapacity: '4 Tons', availableSpace: '800 kg', departureTime: 'Tomorrow, 5:00 AM', pricePerKg: '₹1.5', verified: true },
    { id: 2, vehicleType: 'Chhota Hathi', driverName: 'Rajesh', contact: '91xxxxxxxxxx', fromDistrict: 'Mehsana', toDistrict: 'Surat', totalCapacity: '1.5 Tons', availableSpace: 'Full Space', departureTime: 'Today, 10:00 PM', pricePerKg: '₹3.0', verified: true },
    { id: 3, vehicleType: 'Tata 407', driverName: 'Suresh Patel', contact: '91xxxxxxxxxx', fromDistrict: 'Rajkot', toDistrict: 'Vadodara', totalCapacity: '2.5 Tons', availableSpace: '1.2 Tons', departureTime: '15 Mar, 4:00 AM', pricePerKg: '₹2.1', verified: false },
];

function PostTripModal({ onClose, onSave }: { onClose: () => void; onSave: (trip: Omit<Trip, 'id' | 'verified'>) => void }) {
    const { t } = useLanguage();
    const [form, setForm] = useState({
        vehicleType: 'Chhota Hathi',
        driverName: '',
        contact: '',
        fromDistrict: '',
        toDistrict: '',
        totalCapacity: '',
        availableSpace: '',
        departureTime: '',
        pricePerKg: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: '#1F2937', marginBottom: '8px' }}>🚚 {t('btn_post_trip')}</h2>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>Fill details to help farmers share your truck space</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>{t('vehicle_type')}</label>
                        <select value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontWeight: 600 }}>
                            <option>Chhota Hathi</option>
                            <option>Bolero Pickup</option>
                            <option>Tata 407</option>
                            <option>Eicher 14ft</option>
                            <option>10 Wheeler Truck</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>DRIVER NAME</label>
                        <input required placeholder="Full Name" value={form.driverName} onChange={e => setForm({ ...form, driverName: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #E5E7EB' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>FROM DISTRICT</label>
                        <input required placeholder="e.g. Anand" value={form.fromDistrict} onChange={e => setForm({ ...form, fromDistrict: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #E5E7EB' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>TO DISTRICT</label>
                        <input required placeholder="e.g. Ahmedabad" value={form.toDistrict} onChange={e => setForm({ ...form, toDistrict: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #E5E7EB' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>EMPTY SPACE (KG/TONS)</label>
                        <input required placeholder="e.g. 500 kg" value={form.availableSpace} onChange={e => setForm({ ...form, availableSpace: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #E5E7EB' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>PRICE / KG (₹)</label>
                        <input required placeholder="e.g. 2.0" value={form.pricePerKg} onChange={e => setForm({ ...form, pricePerKg: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #E5E7EB' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>{t('departure')}</label>
                    <input required placeholder="e.g. 15 Mar, 5:00 AM" value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #E5E7EB' }} />
                </div>

                <button type="submit" style={{ width: '100%', background: '#1E40AF', color: 'white', border: 'none', padding: '16px', borderRadius: '50px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', marginBottom: '12px' }}>
                    🌍 Post Logistics Offer
                </button>
                <button type="button" onClick={onClose} style={{ width: '100%', background: '#F3F4F6', color: '#6B7280', border: 'none', padding: '14px', borderRadius: '50px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </form>
        </div>
    );
}

export default function TransportPage() {
    const { t } = useLanguage();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('kisanmart_trips');
        if (saved) setTrips(JSON.parse(saved));
        else setTrips(INITIAL_TRIPS);
    }, []);

    const handleSaveTrip = (newTrip: Omit<Trip, 'id' | 'verified'>) => {
        const fullTrip = { ...newTrip, id: Date.now(), verified: false };
        const updated = [fullTrip, ...trips];
        setTrips(updated);
        localStorage.setItem('kisanmart_trips', JSON.stringify(updated));
    };

    return (
        <div style={{ background: '#F3F6FF', minHeight: '100vh', paddingBottom: '60px' }}>
            <Navigation />

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#1E3A8A', margin: 0 }}>{t('transport_title')}</h1>
                        <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px' }}>{t('transport_subtitle')}</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{ background: '#1E40AF', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(30,64,175,0.2)' }}
                    >
                        {t('btn_post_trip')}
                    </button>
                </div>

                {/* Banner */}
                <div style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', borderRadius: '24px', padding: '32px', color: 'white', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ maxWidth: '60% ' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px' }}>Reduced Transport Costs by 30%</h3>
                        <p style={{ opacity: 0.9, fontSize: '14px', lineHeight: 1.5 }}>Join other farmers to fill returning trucks. Less cost per kg for you, more profit for transporters.</p>
                    </div>
                    <div style={{ fontSize: '64px' }}>🛣️</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {trips.map(trip => (
                        <div key={trip.id} style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '1.5px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ background: '#EFF6FF', color: '#1E40AF', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 800 }}>{trip.vehicleType}</div>
                                {trip.verified && <span title="Verified Transporter" style={{ fontSize: '20px' }}>✅</span>}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '2px', height: '30px', background: '#94A3B8', position: 'relative' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1E40AF', position: 'absolute', top: -5, left: -4 }} />
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', position: 'absolute', bottom: -5, left: -4 }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '16px', color: '#1E293B' }}>{trip.fromDistrict}</div>
                                        <div style={{ height: '10px' }} />
                                        <div style={{ fontWeight: 800, fontSize: '16px', color: '#1E293B' }}>{trip.toDistrict}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', background: '#F8FAFC', padding: '14px', borderRadius: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800, marginBottom: '2px' }}>EMPTY SPACE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>{trip.availableSpace}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800, marginBottom: '2px' }}>EST. PRICE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#15803D' }}>{trip.pricePerKg}/kg</div>
                                </div>
                            </div>

                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📅</span> <b>{trip.departureTime}</b>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>DRIVER</div>
                                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>{trip.driverName}</div>
                                </div>
                                <a href={`https://wa.me/${trip.contact}?text=Hello, I need to book space for ${trip.fromDistrict} to ${trip.toDistrict} trip.`} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', padding: '10px 18px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>
                                    Book 📱
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {showModal && <PostTripModal onClose={() => setShowModal(false)} onSave={handleSaveTrip} />}
        </div>
    );
}
