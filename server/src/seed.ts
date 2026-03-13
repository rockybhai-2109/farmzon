import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create a Test Farmer
    const ramesh = await prisma.user.upsert({
        where: { phone: '9876543210' },
        update: {},
        create: {
            name: 'Ramesh Patel',
            phone: '9876543210',
            email: 'ramesh@farm.com',
            passwordHash,
            role: Role.FARMER,
        }
    });

    const farmerProfile = await prisma.farmerProfile.upsert({
        where: { userId: ramesh.id },
        update: {},
        create: {
            userId: ramesh.id,
            slug: 'ramesh-patel',
            village: 'Anand',
            state: 'Gujarat',
            farmSize: '5 Acres',
            experienceYears: 15,
            farmingType: 'ZBNF Organic',
            bio: 'Starting from a small family plot, I have transitioned our entire farm to Zero Budget Natural Farming (ZBNF) to provide the healthiest chemical-free vegetables to our community.',
            fertilizers: 'Ghan-Jeevamrut, Cow Dung Compost',
            pestControl: 'Neem Astra, Agni Astra',
            waterSystem: 'Solar-powered Drip Irrigation',
            avgRating: 4.8,
            totalOrders: 124,
            isOrganicCertified: true,
            isApproved: true,
        }
    });

    // Create Products
    const products = [
        { name: 'Kesar Mango', price: 120, qty: 50, organic: 'Certified Organic', unit: 'kg' },
        { name: 'Desi Tomatoes', price: 40, qty: 200, organic: 'Natural Farming', unit: 'kg' },
        { name: 'Sweet Corn', price: 30, qty: 150, organic: 'Pesticide Free', unit: 'kg' },
        { name: 'Palak (Spinach)', price: 20, qty: 40, organic: 'Organic', unit: 'bundle' },
    ];

    for (const p of products) {
        await prisma.product.create({
            data: {
                farmerId: farmerProfile.id,
                name: p.name,
                pricePerKg: p.price,
                quantityAvailable: p.qty,
                organicType: p.organic,
                unit: p.unit,
                harvestDate: new Date(),
                isAvailable: true,
            }
        });
    }

    // Create Harvest Calendar
    const calendar = [
        { month: 'April', crop: 'Okra (Bhindi)', output: 'High Yield Expected' },
        { month: 'May', crop: 'Bottle Gourd', output: 'Summer Harvest' },
        { month: 'June', crop: 'Pomegranate', output: 'Premium Quality' },
    ];

    for (const c of calendar) {
        await prisma.harvestCalendar.create({
            data: {
                farmerId: farmerProfile.id,
                month: c.month,
                cropName: c.crop,
                expectedOutput: c.output,
            }
        });
    }

    console.log('Seeding completed: Ramesh Patel profile created at /farmers/ramesh-patel');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
