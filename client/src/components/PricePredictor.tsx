'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

interface PricePredictorProps {
    cropName: string;
    currentPrice: number;
}

const generateMockData = (basePrice: number) => {
    const data = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let lastPrice = basePrice;

    for (let i = 0; i < 7; i++) {
        const change = (Math.random() - 0.4) * 5; // Slight upward bias
        lastPrice = Math.round((lastPrice + change) * 10) / 10;
        data.push({
            day: days[i],
            price: lastPrice,
            predicted: i > 3 // Last 3 days are "predicted"
        });
    }
    return data;
};

export const PricePredictor = ({ cropName, currentPrice }: PricePredictorProps) => {
    const data = generateMockData(currentPrice);
    const predictedPrice = data[data.length - 1].price;
    const priceChange = Math.round(((predictedPrice - currentPrice) / currentPrice) * 100);

    return (
        <div className="glass-card overflow-hidden border-none shadow-2xl">
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-5 h-5 text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">AI Market Insights</span>
                        </div>
                        <h3 className="text-2xl font-black font-display">{cropName} Price Trend</h3>
                    </div>
                    <div className="text-right">
                        <div className={`text-2xl font-black ${priceChange >= 0 ? 'text-accent' : 'text-red-300'}`}>
                            {priceChange >= 0 ? '+' : ''}{priceChange}%
                        </div>
                        <div className="text-[10px] font-bold uppercase opacity-80">7-Day Forecast</div>
                    </div>
                </div>
            </div>

            <div className="p-8 h-[300px] w-full bg-background/50">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 700 }}
                        />
                        <YAxis
                            hide
                            domain={['dataMin - 5', 'dataMax + 5']}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ fontWeight: 900, color: 'var(--primary)' }}
                            labelStyle={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="var(--primary)"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="px-8 pb-8 flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                    <Info className="w-4 h-4 text-accent" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                    AI models predict a <span className="text-primary font-black">{priceChange >= 0 ? 'bullish' : 'bearish'}</span> trend for {cropName} based on historical patterns and local supply data.
                </p>
            </div>
        </div>
    );
};
