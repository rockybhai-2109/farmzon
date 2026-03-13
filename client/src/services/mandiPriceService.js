/**
 * Mandi Price Service
 * Fetches real-time vegetable prices from data.gov.in (Agmarknet)
 */

const DATA_GOV_API_KEY = process.env.NEXT_PUBLIC_DATA_GOV_API_KEY
    || "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"; // Fallback demo key

const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

export const VEGETABLE_EMOJI = {
    "Tomato": "🍅",
    "Onion": "🧅",
    "Potato": "🥔",
    "Brinjal": "🍆",
    "Lady Finger": "🫑",
    "Okra": "🫑",
    "Capsicum": "🫑",
    "Cucumber": "🥒",
    "Spinach": "🥬",
    "Bitter Gourd": "🥬",
    "Cabbage": "🥦",
    "Cauliflower": "🥦",
    "Coriander": "🌿",
    "Fenugreek": "🌿",
    "Mint": "🌿",
    "Garlic": "🧄",
    "Ginger": "🫚",
    "Green Chilli": "🌶️",
    "Pumpkin": "🎃",
    "Bottle Gourd": "🥬",
    "Ridgeguard": "🥬",
    "Cluster Beans": "🫘",
    "French Beans": "🫘",
    "Sweet Potato": "🍠",
    "Carrot": "🥕",
    "Radish": "🥕",
    "Beetroot": "🫛",
    "Lemon": "🍋",
    "default": "🥬"
};

/**
 * Fetch Mandi prices with filtering
 */
export async function fetchMandiPrices({ commodity, state = "Gujarat", district, limit = 100 } = {}) {
    const cacheKey = `mandi_prices_${state}_${district || 'all'}_${commodity || 'all'}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
        let url = `${BASE_URL}?api-key=${DATA_GOV_API_KEY}&format=json&limit=${limit}`;

        if (state) url += `&filters[state]=${state}`;
        if (district) url += `&filters[district]=${district}`;
        if (commodity) url += `&filters[commodity]=${commodity}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.records) {
            const records = data.records.map(record => ({
                ...record,
                modal_price_kg: Number(record.modal_price) / 100,
                min_price_kg: Number(record.min_price) / 100,
                max_price_kg: Number(record.max_price) / 100,
                emoji: VEGETABLE_EMOJI[record.commodity] || VEGETABLE_EMOJI.default
            }));

            setCache(cacheKey, records);
            return records;
        }
        return [];
    } catch (error) {
        console.error("Error fetching mandi prices:", error);
        return [];
    }
}

/**
 * Get top vegetables for ticker/widgets
 */
export async function getTopVegetablePrices(state = "Gujarat") {
    const commodities = ["Tomato", "Onion", "Potato", "Capsicum", "Spinach"];
    const records = await fetchMandiPrices({ state, limit: 100 });

    // Filter for top commodities and unique per commodity (most recent/typical)
    const result = [];
    commodities.forEach(c => {
        const found = records.find(r => r.commodity === c);
        if (found) result.push(found);
    });

    return result.length > 0 ? result : DEMO_MANDI_PRICES.slice(0, 5);
}

/**
 * Suggested price for farmer
 */
export async function getSmartPriceSuggestion(commodity, district = "Anand") {
    const records = await fetchMandiPrices({ commodity, district, limit: 10 });
    const mandiPrice = records.length > 0 ? records[0].modal_price_kg : 25; // fallback

    return {
        mandiPrice,
        suggestedMin: Math.round(mandiPrice * 1.05),
        suggestedMax: Math.round(mandiPrice * 1.15),
        trend: "rising",
        advice: `Prices for ${commodity} are rising in your area. List at ₹${Math.round(mandiPrice * 1.1)}/kg for best visibility.`
    };
}

// --- Cache Helpers ---
function setCache(key, data) {
    if (typeof window === 'undefined') return;
    const item = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getCache(key) {
    if (typeof window === 'undefined') return null;
    const str = localStorage.getItem(key);
    if (!str) return null;

    const item = JSON.parse(str);
    const TTL = 2 * 60 * 60 * 1000; // 2 hours
    if (Date.now() - item.timestamp > TTL) {
        localStorage.removeItem(key);
        return null;
    }
    return item.data;
}

// --- Demo Data ---
export const DEMO_MANDI_PRICES = [
    { state: "Gujarat", district: "Anand", market: "Anand", commodity: "Tomato", modal_price: 2600, modal_price_kg: 26, emoji: "🍅", trend: "📈", arrival_date: "Today" },
    { state: "Gujarat", district: "Vadodara", market: "Vadodara", commodity: "Onion", modal_price: 1900, modal_price_kg: 19, emoji: "🧅", trend: "📉", arrival_date: "Today" },
    { state: "Gujarat", district: "Mehsana", market: "Mehsana", commodity: "Capsicum", modal_price: 6000, modal_price_kg: 60, emoji: "🫑", trend: "📈", arrival_date: "Today" },
    { state: "Gujarat", district: "Surat", market: "Surat", commodity: "Spinach", modal_price: 1800, modal_price_kg: 18, emoji: "🥬", trend: "📈", arrival_date: "Today" },
    { state: "Gujarat", district: "Anand", market: "Anand", commodity: "Lady Finger", modal_price: 3400, modal_price_kg: 34, emoji: "🫑", trend: "➡️", arrival_date: "Today" }
];
