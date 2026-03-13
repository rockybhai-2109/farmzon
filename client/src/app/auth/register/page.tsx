'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tractor, ArrowRight, Lock, Phone, User, MapPin, ShieldCheck, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState(1);
    const [role, setRole] = useState(searchParams.get('role') || 'BUYER');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        village: '',
        state: 'Gujarat',
        farmSize: '',
        businessType: 'CONSUMER'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role,
                    profileData: role === 'FARMER'
                        ? { village: formData.village, state: formData.state, farmSize: formData.farmSize }
                        : { businessType: formData.businessType }
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Redirect to login after success
            router.push('/auth/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

            <Card className="w-full max-w-xl relative z-10 bg-white/95 backdrop-blur-2xl border-white/20 shadow-2xl rounded-[3rem] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-green-400"></div>

                <CardHeader className="pt-12 pb-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 scale-110 shadow-inner">
                        <Tractor className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Create Account</CardTitle>
                    <CardDescription className="text-gray-500 font-medium pt-1">Join the organic movement today</CardDescription>
                </CardHeader>

                <CardContent className="px-10 pb-12">
                    {/* Step Indicator */}
                    <div className="flex gap-2 mb-10 justify-center">
                        <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-primary' : 'bg-gray-100'}`}></div>
                        <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary' : 'bg-gray-100'}`}></div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold">
                            <ShieldCheck className="h-5 w-5 text-red-400" />
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Who are you?</h3>
                                <p className="text-gray-500 text-sm">Choose your role to get started</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setRole('FARMER')}
                                    className={`relative p-6 rounded-3xl border-2 transition-all text-left group overflow-hidden ${role === 'FARMER' ? 'border-primary bg-primary/5 shadow-xl' : 'border-gray-100 hover:border-primary/50 bg-gray-50/50'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${role === 'FARMER' ? 'bg-primary text-white' : 'bg-white text-gray-400 shadow-sm'
                                        }`}>
                                        <Tractor className="h-6 w-6" />
                                    </div>
                                    <h4 className={`font-black text-lg ${role === 'FARMER' ? 'text-gray-900' : 'text-gray-400'}`}>I'm a Farmer</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Sell Produce</p>

                                    {role === 'FARMER' && (
                                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl"></div>
                                    )}
                                </button>

                                <button
                                    onClick={() => setRole('BUYER')}
                                    className={`relative p-6 rounded-3xl border-2 transition-all text-left group overflow-hidden ${role === 'BUYER' ? 'border-primary bg-primary/5 shadow-xl' : 'border-gray-100 hover:border-primary/50 bg-gray-50/50'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${role === 'BUYER' ? 'bg-primary text-white' : 'bg-white text-gray-400 shadow-sm'
                                        }`}>
                                        <ShoppingCart className="h-6 w-6" />
                                    </div>
                                    <h4 className={`font-black text-lg ${role === 'BUYER' ? 'text-gray-900' : 'text-gray-400'}`}>I'm a Buyer</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Order Fresh</p>

                                    {role === 'BUYER' && (
                                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl"></div>
                                    )}
                                </button>
                            </div>

                            <Button
                                onClick={() => setStep(2)}
                                className="w-full h-16 rounded-[1.5rem] bg-primary hover:bg-green-600 text-lg font-black shadow-xl shadow-primary/30 group"
                            >
                                CONTINUE <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 flex-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input name="name" placeholder="Rajesh Patel" className="h-12 pl-10 rounded-xl" value={formData.name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="space-y-1.5 flex-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input name="phone" placeholder="9876543210" className="h-12 pl-10 rounded-xl" value={formData.phone} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input name="password" type="password" placeholder="Min 6 characters" className="h-12 pl-10 rounded-xl" value={formData.password} onChange={handleChange} required />
                                </div>
                            </div>

                            {role === 'FARMER' ? (
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Village</label>
                                        <Input name="village" placeholder="Village Name" className="h-12 rounded-xl" value={formData.village} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Farm Size</label>
                                        <Input name="farmSize" placeholder="e.g. 5 Acres" className="h-12 rounded-xl" value={formData.farmSize} onChange={handleChange} required />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Business Type</label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={(e: any) => handleChange(e)}
                                        className="w-full h-12 rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="CONSUMER">Individual Buyer</option>
                                        <option value="SHOP">Retailer / Shop</option>
                                        <option value="RESTAURANT">Hotel / Restaurant</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="h-14 px-6 rounded-2xl border-2 font-bold"
                                >
                                    BACK
                                </Button>
                                <Button
                                    disabled={loading}
                                    className="flex-1 h-14 rounded-2xl bg-primary hover:bg-green-600 font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
                                >
                                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'CREATE ACCOUNT'}
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 text-center pt-6 border-t border-gray-50">
                        <p className="text-gray-500 font-medium">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-primary font-black hover:underline">Log In</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
