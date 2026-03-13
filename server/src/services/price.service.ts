import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// The endpoint for "Current Daily Price of Various Commodities from Various Markets (Mandi)"
// The Resource ID might change based on the exact dataset you choose from the UI, 
// usually it is of the format: 9ef84268-d588-465a-a308-a864a43d0070
// Update this URL if the resource ID changes.
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'; // Common resource ID for mandi prices

export const fetchAndSaveGujaratPrices = async () => {
    const API_KEY = process.env.DATA_GOV_API_KEY;

    if (!API_KEY) {
        console.warn('⚠️ Missing DATA_GOV_API_KEY in .env. Skipping live price fetch.');
        return;
    }

    try {
        console.log('Fetching live Mandi prices for Gujarat...');

        // Fetch data from data.gov.in API 
        // We filter by state="Gujarat" and fetch up to 100 recent records
        const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&filters[state]=Gujarat&limit=100`;

        const response = await axios.get(url);
        const records = response.data.records;

        if (!records || records.length === 0) {
            console.log('No records found for Gujarat today.');
            return;
        }

        console.log(`Found ${records.length} live records for Gujarat. Saving to DB...`);
        const parsedRecords = [];

        // Loop through the records and save them
        for (const record of records) {
            // record.commodity = Crop name
            // record.district = Region
            // record.modal_price = Price per Quintal (100kg). Divide by 100 for price per Kg.
            const averagePricePerKg = parseFloat(record.modal_price) / 100;

            parsedRecords.push({
                id: record.commodity + '-' + record.district, // pseudo-id since there's no DB
                cropName: record.commodity,
                region: record.district,
                averagePrice: averagePricePerKg,
                date: new Date().toISOString()
            });

            try {
                const existing = await prisma.marketPrice.findFirst({
                    where: {
                        cropName: record.commodity,
                        region: record.district,
                        date: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                });

                if (!existing) {
                    await prisma.marketPrice.create({
                        data: {
                            cropName: record.commodity,
                            region: record.district,
                            averagePrice: averagePricePerKg,
                        }
                    });
                }
            } catch (dbError) {
                // Ignore DB insert errors if DB is down, UI will still get live data
            }
        }
        console.log('✅ Daily Gujarat prices fetched successfully!');
        return parsedRecords;
    } catch (error: any) {
        console.error('❌ Failed to update daily prices from data.gov.in:', error?.response?.data || error.message);
        return [];
    }
};
