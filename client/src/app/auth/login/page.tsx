'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tractor, ArrowRight, Lock, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save token and role (Simplified for demo)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'FARMER') {
                router.push('/dashboard');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <Card className="w-full max-w-md relative z-10 bg-white/90 backdrop-blur-xl border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-green-400"></div>

                <CardHeader className="pt-12 pb-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 scale-110 shadow-inner">
                        <Tractor className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</CardTitle>
                    <CardDescription className="text-gray-500 font-medium">Log in to your farm dashboard</CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-12">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="tel"
                                    placeholder="Enter your registered number"
                                    className="h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all font-medium text-lg"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
                                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all font-medium text-lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            disabled={loading}
                            className="w-full h-16 rounded-2xl bg-primary hover:bg-green-600 text-lg font-black shadow-xl shadow-primary/30 transition-all active:scale-95 group"
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            ) : (
                                <>
                                    LOG IN <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 font-medium">
                            Don't have an account?{' '}
                            <Link href="/auth/register" className="text-primary font-black hover:underline">Create Account</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
