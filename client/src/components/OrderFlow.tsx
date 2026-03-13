import React, { useState, useEffect } from 'react';
import { Zap, Timer, CheckCircle2, ChevronRight, MapPin, Truck, Tractor, Package, Info, Check, X, Clock, Handshake, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import LocationButton from './location/LocationButton';
import AddressAutocomplete from './location/AddressAutocomplete';
import MiniMap from './location/MiniMap';
import LiveTrackingMap from './location/LiveTrackingMap';

interface OrderFlowProps {
    item: any;
    qty: number;
    onClose: () => void;
}

export default function OrderFlow({ item, qty: initialQty, onClose }: OrderFlowProps) {
    const { t, language } = useLanguage();
    const { userLocation, setUserLocation } = useLocation();
    const [step, setStep] = useState(1);
    const [qty, setQty] = useState(initialQty);
    const [deliveryType, setDeliveryType] = useState('pickup');
    const [buyerType, setBuyerType] = useState('veg_shop');
    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');
    const [specialNote, setSpecialNote] = useState('');
    const [negotiate, setNegotiate] = useState(false);
    const [offerPrice, setOfferPrice] = useState(item.price);
    const [offerMsg, setOfferMsg] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasSavedProfile, setHasSavedProfile] = useState(false);

    // Synchronize address from context if user picks via map/GPS
    useEffect(() => {
        if (userLocation?.address) {
            setAddress(userLocation.address);
        }
    }, [userLocation]);

    // Load profile on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('kisanmart_buyer_profile');
            if (saved) {
                const profile = JSON.parse(saved);
                setBusinessName(profile.businessName || '');
                setBuyerType(profile.buyerType || 'veg_shop');
                setAddress(profile.address || '');
                setHasSavedProfile(true);
            }
        } catch (e) { }
    }, []);

    const saveProfile = () => {
        const profile = { businessName, buyerType, address };
        localStorage.setItem('kisanmart_buyer_profile', JSON.stringify(profile));
    };

    const vegTotal = item.price * qty;
    const deliveryFee = deliveryType === 'delivery' ? 150 : 0;
    const grandTotal = negotiate ? offerPrice * qty + deliveryFee : vegTotal + deliveryFee;

    const nextStep = () => {
        // FAST PATH: If skip-to-confirm is possible
        if (step === 2 && hasSavedProfile && !negotiate && deliveryType === 'pickup') {
            setStep(5);
        } else {
            setStep(step + 1);
        }
    };
    const prevStep = () => setStep(step - 1);

    const steps = [
        { id: 1, label: t('order_step1') },
        { id: 2, label: t('order_step2') },
        { id: 3, label: t('order_step3') },
        { id: 4, label: t('order_step4') },
        { id: 5, label: t('order_step5') },
    ];

    if (isSuccess) {
        const orderId = `KM-${Math.floor(100000 + Math.random() * 900000)}`;
        return (
            <div className="km-modal-overlay">
                <div className="km-order-modal">
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                                <CheckCircle2 size={48} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '24px', color: '#166534', marginBottom: '8px', fontWeight: 900 }}>{t('success_head')}</h2>
                        <p style={{ color: '#6B7280', fontSize: '14px' }}>{t('success_sub')}</p>

                        <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px', margin: '20px 0', border: '2px dashed #E2E8F0' }}>
                            <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '4px' }}>{t('order_id_label')}</div>
                            <div style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A' }}>{orderId}</div>
                        </div>

                        {deliveryType === 'delivery' ? (
                            <div style={{ marginTop: '20px' }}>
                                <LiveTrackingMap order={{ id: orderId }} />
                            </div>
                        ) : (
                            <div style={{ textAlign: 'left', marginBottom: '20px', background: '#F1F5F9', padding: '16px', borderRadius: '16px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 900, marginBottom: '12px', color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('next_timeline_title')}</h4>
                                {[
                                    { icon: <Check size={14} />, label: t('timeline_sent'), color: '#22C55E' },
                                    { icon: <Handshake size={14} />, label: t('timeline_confirm'), color: '#64748B' },
                                    { icon: <Truck size={14} />, label: t('timeline_delivery'), color: '#64748B' }
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%',
                                            background: idx === 0 ? '#DCFCE7' : 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: item.color, border: '1px solid #E2E8F0'
                                        }}>
                                            {item.icon}
                                        </div>
                                        <span style={{ fontSize: '13px', color: idx === 0 ? '#166534' : '#64748B', fontWeight: idx === 0 ? 800 : 600 }}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button className="km-btn-primary" style={{ width: '100%', justifyContent: 'center', height: '54px' }}>
                                <MessageSquare size={18} /> WhatsApp — {item.farmer}
                            </button>
                            <button onClick={onClose} style={{ background: 'none', border: '2px solid #E2E8F0', borderRadius: '50px', padding: '12px', fontWeight: 800, cursor: 'pointer', color: '#64748B', fontSize: '14px' }}>
                                {t('go_home')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="km-modal-overlay">
            <div className="km-order-modal">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#1E293B' }}>{t('order_confirm_title')}</h2>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                            {steps.map((s) => (
                                <div key={s.id} style={{ height: '3px', width: '25px', borderRadius: '2px', background: s.id <= step ? '#2D5016' : '#E2E8F0' }} />
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Step Content */}
                <div style={{ minHeight: '280px' }}>
                    {step === 1 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ fontSize: '48px', background: '#F0FDF4', width: '80px', height: '80px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.emoji}</div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#166534' }}>{item.localizedName}</h3>
                                    <p style={{ color: '#64748B', fontSize: '13px', fontWeight: 600 }}>{item.farmer} · {item.location}</p>
                                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                                        <span style={{ fontSize: '9px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>{t('organic_certified')}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: '#64748B', fontWeight: 700, fontSize: '14px' }}>{t('order_quantity')}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', background: 'white' }}>
                                        <button onClick={() => setQty(Math.max(item.minOrder, qty - 25))} style={{ background: '#F8FAFC', border: 'none', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 800 }}>−</button>
                                        <span style={{ padding: '0 12px', fontWeight: 800, minWidth: '50px', textAlign: 'center', fontSize: '14px' }}>{qty} {t('qty_kg')}</span>
                                        <button onClick={() => setQty(qty + 25)} style={{ background: '#F8FAFC', border: 'none', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 800 }}>+</button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                                    <span style={{ color: '#64748B', fontWeight: 700, fontSize: '14px' }}>{t('order_total')}</span>
                                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#166534' }}>₹{vegTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '16px' }}>{t('delivery_head')}</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                <div
                                    onClick={() => setDeliveryType('pickup')}
                                    style={{
                                        padding: '12px', border: '2px solid', borderRadius: '16px', cursor: 'pointer',
                                        borderColor: deliveryType === 'pickup' ? '#2D5016' : '#E2E8F0',
                                        background: deliveryType === 'pickup' ? '#F0FDF4' : 'white'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Tractor size={18} className={deliveryType === 'pickup' ? 'text-primary' : 'text-slate-400'} />
                                            <span style={{ fontWeight: 800, fontSize: '14px' }}>{t('pickup_option')}</span>
                                        </div>
                                        <span style={{ color: '#166534', fontWeight: 800, fontSize: '11px', background: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>{t('pickup_cheaper')}</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', paddingLeft: '26px' }}>{t('pickup_subtitle')}</p>
                                </div>

                                <div
                                    onClick={() => setDeliveryType('delivery')}
                                    style={{
                                        padding: '12px', border: '2px solid', borderRadius: '16px', cursor: 'pointer',
                                        borderColor: deliveryType === 'delivery' ? '#2D5016' : '#E2E8F0',
                                        background: deliveryType === 'delivery' ? '#F0FDF4' : 'white'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Truck size={18} className={deliveryType === 'delivery' ? 'text-primary' : 'text-slate-400'} />
                                            <span style={{ fontWeight: 800, fontSize: '14px' }}>{t('delivery_option')}</span>
                                        </div>
                                        <span style={{ color: '#166534', fontWeight: 800, fontSize: '14px' }}>₹{deliveryFee}</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', paddingLeft: '26px' }}>{t('delivery_subtitle')}</p>
                                </div>
                            </div>

                            {deliveryType === 'delivery' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>
                                            <MapPin size={14} className="text-primary" />
                                            {language === 'gu' ? 'તમારી ડિલિવરી લોકેશન' : 'आपकी डिलीवरी लोकेशन'}
                                        </label>
                                        <div style={{ marginBottom: '12px' }}>
                                            <LocationButton />
                                        </div>
                                        <div style={{ marginBottom: '12px' }}>
                                            <AddressAutocomplete />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <MiniMap />
                                        </div>

                                        <div style={{ marginTop: '12px' }}>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, marginBottom: '6px', color: '#64748B', textTransform: 'uppercase' }}>
                                                {t('business_address')} (કન્ફર્મ કરો)
                                            </label>
                                            <textarea
                                                placeholder={t('address_placeholder')}
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0', height: '54px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {deliveryType === 'pickup' && (
                                <div style={{ marginTop: '16px', background: '#FEF2F2', padding: '16px', borderRadius: '16px', border: '1px solid #FEE2E2', fontSize: '13px', color: '#991B1B' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, marginBottom: '4px', fontSize: '15px' }}>
                                        <MapPin size={16} /> {t('pickup_location_label')}
                                    </div>
                                    <div style={{ fontWeight: 800, color: '#111827' }}>{item.location}</div>
                                    <div style={{ marginTop: '8px', opacity: 0.8, fontSize: '11px', lineHeight: 1.5, background: 'white', padding: '8px', borderRadius: '8px', fontWeight: 600 }}>
                                        <Info size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                        {language === 'gu' ? 'નોંધ: તમારે જાતે ખેતરે જઈને શાકભાજી લેવાના રહેશે.' : 'नोट: आपको खुद खेत पर जाकर सब्जियां लेनी होंगी।'}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '16px' }}>{t('buyer_details_head')}</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>{t('business_name')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('business_placeholder')}
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>{t('type_other')}</label>
                                    <select
                                        value={buyerType}
                                        onChange={(e) => setBuyerType(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 600, fontSize: '13px' }}
                                    >
                                        <option value="veg_shop">{t('type_veg_shop')}</option>
                                        <option value="restaurant">{t('type_restaurant')}</option>
                                        <option value="distributor">{t('type_distributor')}</option>
                                        <option value="supermarket">{t('type_supermarket')}</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>{t('special_note')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('special_placeholder')}
                                        value={specialNote}
                                        onChange={(e) => setSpecialNote(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '16px' }}>{t('fix_price_head')}</h3>

                            <div
                                onClick={() => setNegotiate(false)}
                                style={{
                                    padding: '16px', border: '2px solid', borderRadius: '16px', cursor: 'pointer', marginBottom: '10px',
                                    borderColor: !negotiate ? '#2D5016' : '#E2E8F0',
                                    background: !negotiate ? '#F0FDF4' : 'white'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: 900, fontSize: '15px' }}>₹{item.price}/kg — સ્વીકારો</span>
                                        <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>ખેડૂતને તરત ઓર્ડર જશે (ઝડપ)</p>
                                    </div>
                                    <div style={{ background: '#DCFCE7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Zap size={12} fill="currentColor" /> FAST
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => setNegotiate(true)}
                                style={{
                                    padding: '16px', border: '2px solid', borderRadius: '16px', cursor: 'pointer',
                                    borderColor: negotiate ? '#2D5016' : '#E2E8F0',
                                    background: negotiate ? '#F5F3FF' : 'white'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: 900, fontSize: '15px' }}>{language === 'gu' ? '💬 ભાવતાલ કરો' : '💬 मोलभाव करें'}</span>
                                        <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>ખેડૂતને તમારી કિંમત ઓફર કરો</p>
                                    </div>
                                    <div style={{ background: '#EDE9FE', color: '#6D28D9', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Timer size={12} /> 4-8h
                                    </div>
                                </div>

                                {negotiate && (
                                    <div style={{ marginTop: '16px', padding: '12px', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0 shadow-sm' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 800 }}>{t('your_offer_label')}</label>
                                            <span style={{ fontWeight: 900, color: '#6D28D9', fontSize: '15px' }}>₹{offerPrice}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={item.price - 10}
                                            max={item.price + 2}
                                            value={offerPrice}
                                            onChange={(e) => setOfferPrice(parseInt(e.target.value))}
                                            style={{ width: '100%', accentColor: '#6D28D9', height: '6px', cursor: 'pointer' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginTop: '8px', fontWeight: 700 }}>
                                            <span>₹{item.price - 10}</span>
                                            <span style={{ background: '#F8FAFC', padding: '2px 6px', borderRadius: '4px' }}>{t('suggested_price', { range: `${item.price - 5}-${item.price - 2}` })}</span>
                                            <span>₹{item.price + 2}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '16px' }}>{t('confirm_head')}</h3>

                            <div style={{ background: '#FFF7ED', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1px solid #FFEDD5' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '6px 0', color: '#9A3412', fontSize: '13px', fontWeight: 700 }}>{t('order_vegetable')}</td>
                                            <td style={{ padding: '6px 0', fontWeight: 900, textAlign: 'right', fontSize: '14px' }}>{item.localizedName}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '6px 0', color: '#9A3412', fontSize: '13px', fontWeight: 700 }}>{t('order_quantity')}</td>
                                            <td style={{ padding: '6px 0', fontWeight: 900, textAlign: 'right', fontSize: '14px' }}>{qty} kg</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '6px 0', color: '#9A3412', fontSize: '13px', fontWeight: 700 }}>{t('order_rate')}</td>
                                            <td style={{ padding: '6px 0', fontWeight: 900, textAlign: 'right', fontSize: '14px' }}>₹{negotiate ? offerPrice : item.price}/kg</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '6px 0', color: '#9A3412', fontSize: '13px', fontWeight: 700 }}>{t('delivery_total')}</td>
                                            <td style={{ padding: '6px 0', fontWeight: 900, textAlign: 'right', color: '#166534', fontSize: '14px' }}>{deliveryType === 'pickup' ? 'FREE' : `₹${deliveryFee}`}</td>
                                        </tr>
                                        <tr style={{ borderTop: '2px solid #FED7AA', marginTop: '8px' }}>
                                            <td style={{ padding: '12px 0 0 0', fontWeight: 900, color: '#431407', fontSize: '15px' }}>{t('grand_total')}</td>
                                            <td style={{ padding: '12px 0 0 0', fontWeight: 900, color: '#166534', textAlign: 'right', fontSize: '20px' }}>₹{grandTotal.toLocaleString('en-IN')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', background: '#F0FDF4', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2D5016', cursor: 'pointer' }}
                                />
                                <label htmlFor="terms" style={{ fontSize: '11px', color: '#166534', fontWeight: 700, lineHeight: 1.5, cursor: 'pointer' }}>{t('terms_check')}</label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    {step > 1 && (
                        <button onClick={prevStep} style={{ flex: 1, background: '#F1F5F9', border: 'none', borderRadius: '50px', padding: '14px', fontWeight: 900, cursor: 'pointer', color: '#64748B', fontSize: '14px' }}>
                            {t('btn_back')}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (step === 5) {
                                if (termsAccepted) {
                                    const order = {
                                        id: `KM-${Math.floor(100000 + Math.random() * 900000)}`,
                                        date: new Date().toISOString(),
                                        item: item.localizedName,
                                        emoji: item.emoji,
                                        qty,
                                        total: grandTotal,
                                        status: 'pending'
                                    };
                                    const history = JSON.parse(localStorage.getItem('kisanmart_order_history') || '[]');
                                    localStorage.setItem('kisanmart_order_history', JSON.stringify([order, ...history]));
                                    saveProfile();
                                    setIsSuccess(true);
                                }
                            } else {
                                nextStep();
                            }
                        }}
                        disabled={step === 5 && !termsAccepted}
                        className="km-btn-primary"
                        style={{ flex: 2, height: '54px', justifyContent: 'center', opacity: (step === 5 && !termsAccepted) ? 0.6 : 1, fontSize: '15px' }}
                    >
                        {step === 5 ? (
                            <div className="flex items-center gap-2">
                                <Package size={18} /> {t('btn_confirm_order')}
                            </div>
                        ) : (
                            step === 2 && hasSavedProfile && !negotiate && deliveryType === 'pickup'
                                ? <div className="flex items-center gap-2 italic"><Zap size={18} fill="currentColor" /> {t('btn_next')} (સ્કીપ કરો)</div>
                                : <div className="flex items-center gap-2">{t('btn_next')} <ChevronRight size={18} /></div>
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .km-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.75);
                    backdrop-filter: blur(8px);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                }
                .km-order-modal {
                    background: white;
                    width: 100%;
                    max-width: 440px;
                    border-radius: 28px;
                    padding: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                }
                @media (max-width: 480px) {
                    .km-order-modal {
                        max-width: 100%;
                        height: 100%;
                        max-height: 100%;
                        border-radius: 24px;
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
}
