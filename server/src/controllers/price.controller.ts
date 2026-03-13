import { Request, Response } from 'express';
import prisma from '../lib/prisma';

import { fetchAndSaveGujaratPrices } from '../services/price.service';

// Get recent market price trends/insights
export const getPriceInsights = async (req: Request, res: Response): Promise<void> => {
    try {
        let liveDataFallback: any[] = [];
        // Trigger a live fetch to grab the latest data from data.gov.in
        try {
            const externalData = await fetchAndSaveGujaratPrices(); // Need to modify service to return this
            if (externalData && externalData.length > 0) {
                liveDataFallback = externalData;
            }
        } catch (liveFetchError) {
            console.error('Live fetch failed:', liveFetchError);
        }

        try {
            // Attempt to Fetch the 20 most recent market prices from DB
            const recentPrices = await prisma.marketPrice.findMany({
                orderBy: { date: 'desc' },
                take: 20
            });
            res.json({ insights: recentPrices.length > 0 ? recentPrices : liveDataFallback });
        } catch (dbError) {
            console.error('Database unreachable. Serving live API data directly.');
            res.json({ insights: liveDataFallback });
        }
    } catch (error: any) {
        console.error('Fetch price insights error:', error);
        res.status(500).json({ error: 'Server error fetching price insights' });
    }
};

// Get historical price data for a specific crop (useful for line charts)
export const getPriceHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cropName, region } = req.query;

        if (!cropName) {
            res.status(400).json({ error: 'cropName query parameter is required' });
            return;
        }

        const history = await prisma.marketPrice.findMany({
            where: {
                cropName: String(cropName),
                ...(region && { region: String(region) })
            },
            orderBy: { date: 'asc' } // Orders historically from oldest to newest
        });

        res.json({ history });
    } catch (error: any) {
        console.error('Fetch price history error:', error);
        res.status(500).json({ error: 'Server error fetching price history' });
    }
};
