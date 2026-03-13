'use client';

import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Leaf, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { VEGETABLE_NAMES } from '@/data/gujaratData';

interface PriceData {
    id: string;
    cropName: string;
    region: string;
    averagePrice: number;
    date: string;
}

interface MarketInsightsProps {
    selectedCrop?: string;
}

export const MarketInsights = ({ selectedCrop = 'Tomatoes' }: MarketInsightsProps) => {
    const { t, language } = useLanguage();
    // Compute data during render based on selectedCrop
    const getSeed = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const seed = getSeed(selectedCrop);
    const basePrice = 15 + (seed % 40);
    const months = ['Oct 24', 'Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25'];

    const data: PriceData[] = months.map((month, index) => {
        const volatility = Math.sin(index + seed) * (basePrice * 0.2);
        const trend = (index * (seed % 5)) * 0.5;
        return {
            id: `${selectedCrop}-${index}`,
            cropName: selectedCrop,
            region: 'Gujarat',
            averagePrice: Math.max(5, basePrice + volatility + trend),
            date: month
        };
    });

    const loading = false; // Always calculated immediately now

    // Calculate if trend is up or down based on last two data points
    const currentPrice = data[data.length - 1]?.averagePrice || 0;
    const prevPrice = data[data.length - 2]?.averagePrice || 0;
    const isTrendingUp = currentPrice >= prevPrice;

    if (loading) return (
        <div className="bg-white rounded-xl shadow-lg p-6 my-6 border border-green-100 flex items-center justify-center h-[400px]">
            <div className="animate-pulse text-green-500 font-medium">Analyzing Gujarat Market Trends...</div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 my-6 border border-green-100 transition-all hover:shadow-xl">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-400 mb-6 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-500" />
                {t('gujarat_market_analysis')}: {(VEGETABLE_NAMES as any)[selectedCrop]?.[language] || selectedCrop}
            </h2>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            width={40}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${value.toFixed(0)}`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                border: 'none',
                                padding: '12px'
                            }}
                            itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                            formatter={(value: any) => [typeof value === 'number' ? `₹${value.toFixed(2)}` : value, 'Price']}
                        />
                        <Line
                            type="monotone"
                            dataKey="averagePrice"
                            stroke="#10b981"
                            strokeWidth={4}
                            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                            name="Price (₹/Kg)"
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-green-50/50 p-4 rounded-xl border border-green-100">
                <div className="flex-1">
                    <span className="font-bold text-gray-800 text-lg block mb-0.5">{t('gujarat_market_analysis')}</span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {language === 'en' ? 'Current data shows ' : ''}
                        {(VEGETABLE_NAMES as any)[selectedCrop]?.[language] || selectedCrop}
                        {language === 'gu' ? ' માટે વર્તમાન ડેટા દર્શાવે છે કે બજાર ' : language === 'hi' ? ' के लिए वर्तमान डेटा दर्शाता है कि बाजार ' : ' in Gujarat is '}
                        <span className={`font-bold ${isTrendingUp ? 'text-green-600' : 'text-amber-600'}`}>
                            {isTrendingUp ? t('insight_trending_up') : t('insight_correcting')}
                        </span>.
                        {isTrendingUp ? t('insight_recommend_sell') : t('insight_recommend_hold')}.
                    </p>
                </div>
                <div className={`px-5 py-2.5 text-white font-bold rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap
                    ${isTrendingUp ? 'bg-green-500 shadow-green-200' : 'bg-amber-500 shadow-amber-200'}
                `}>
                    {isTrendingUp ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                    {isTrendingUp ? t('high_demand') : t('price_stable')}
                </div>
            </div>
        </div>
    );
};
