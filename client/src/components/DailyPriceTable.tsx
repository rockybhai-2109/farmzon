'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DailyPrice {
    id: string;
    cropName: string;
    region: string;
    price: number;
    change: number;
    status: 'up' | 'down' | 'stable';
    date: string;
}

// Dummy data to showcase the table's premium design
const DUMMY_DATA: DailyPrice[] = [
    { id: '1', cropName: 'Tomatoes', region: 'Maharashtra', price: 32.50, change: 8.4, status: 'up', date: 'Today' },
    { id: '2', cropName: 'Onions', region: 'Nashik', price: 24.00, change: -2.1, status: 'down', date: 'Today' },
    { id: '3', cropName: 'Potatoes', region: 'Punjab', price: 18.00, change: 0.0, status: 'stable', date: 'Today' },
    { id: '4', cropName: 'Spinach', region: 'Karnataka', price: 45.00, change: 12.5, status: 'up', date: 'Today' },
    { id: '5', cropName: 'Carrots', region: 'Gujarat', price: 38.00, change: -5.2, status: 'down', date: 'Today' },
];

export const DailyPriceTable = ({ onSelectCrop }: { onSelectCrop?: (crop: string) => void }) => {
    const [data, setData] = useState<DailyPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        // Fetch live market data from our backend
        fetch('http://localhost:5000/api/prices/insights')
            .then(res => res.json())
            .then(json => {
                const mappedData = json.insights.map((item: any) => ({
                    id: item.id || `${item.cropName}-${item.region}-${item.date}`,
                    cropName: item.cropName,
                    region: item.region,
                    price: item.averagePrice,
                    change: 0,
                    status: 'stable',
                    date: new Date(item.date).toLocaleDateString()
                }));

                if (mappedData.length > 0) {
                    setData(mappedData);
                } else {
                    setData(DUMMY_DATA);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching live data:', error);
                setData(DUMMY_DATA);
                setLoading(false);
            });
    }, []);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDistrict]);

    // Get unique districts for the dropdown
    const districts = ['All Districts', ...Array.from(new Set(data.map(item => item.region)))].sort();

    // Filter logic
    const filteredData = data.filter(item => {
        const matchesSearch = item.cropName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDistrict = selectedDistrict === 'All Districts' || item.region === selectedDistrict;
        return matchesSearch && matchesDistrict;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
        return (
            <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Gujarat Mandi Prices</h3>
                        <p className="text-sm text-gray-500 mt-1 uppercase tracking-tighter font-semibold text-emerald-600">State-wise Live Updates</p>
                    </div>
                    <div className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-green-600 border border-green-200 shadow-sm flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search crops..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer shadow-sm"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                        >
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto min-h-[420px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                            <th className="p-4 border-b border-gray-100">Crop Name</th>
                            <th className="p-4 border-b border-gray-100">District</th>
                            <th className="p-4 border-b border-gray-100 text-center">Price</th>
                            <th className="p-4 border-b border-gray-100 text-right">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-green-50/50 transition-colors group cursor-pointer"
                                    onClick={() => onSelectCrop?.(item.cropName)}
                                >
                                    <td className="p-4">
                                        <span className="font-bold text-gray-800 group-hover:text-primary transition-colors block leading-tight">
                                            {item.cropName}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium">Updated today</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                                            {item.region}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-sm font-black text-gray-900">
                                            ₹{item.price.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full
                                            ${item.status === 'up' ? 'bg-green-100 text-green-700' :
                                                item.status === 'down' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'}
                                        `}>
                                            {item.status === 'up' && <TrendingUp className="w-3 h-3" />}
                                            {item.status === 'down' && <TrendingDown className="w-3 h-3" />}
                                            {item.status === 'stable' && <Minus className="w-3 h-3" />}
                                            {item.change}%
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-20 text-center">
                                    <p className="text-gray-400 font-medium">No records found for "{searchTerm}"</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Total {filteredData.length} records
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${currentPage === 1 ? 'text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed' : 'text-gray-600 border-gray-200 hover:border-primary hover:text-primary active:scale-95'}`}
                        >
                            PREV
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${currentPage === totalPages ? 'text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed' : 'text-gray-600 border-gray-200 hover:border-primary hover:text-primary active:scale-95'}`}
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
