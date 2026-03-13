import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { fetchAndSaveGujaratPrices } from '../services/price.service';

// Helper to generate slug from name
const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export const getFarmerProfile = async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    try {
        const profile = await prisma.farmerProfile.findUnique({
            where: { slug },
            include: {
                user: {
                    select: {
                        name: true,
                        phone: true,
                        email: true,
                    }
                },
                products: {
                    where: { isAvailable: true }
                },
                harvestCalendar: true,
                followers: true,
            }
        });

        if (!profile) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        res.json(profile);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMyProfile = async (req: any, res: Response) => {
    const userId = req.user.id;
    const updateData = req.body;

    try {
        // Ensure slug is updated if name changes (not handling name change here for simplicity)
        // In a real app, we'd check if the slug is unique

        const profile = await prisma.farmerProfile.update({
            where: { userId },
            data: {
                ...updateData,
                updatedAt: new Date() // if we had updatedAt
            }
        });

        res.json(profile);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAvailableCrops = async (req: Request, res: Response) => {
    try {
        // Pull latest crop names from Mandi API service
        const livePrices = await fetchAndSaveGujaratPrices();
        if (!livePrices) return res.json([]);

        const uniqueCrops = Array.from(new Set(livePrices.map((p: any) => p.cropName))).sort();
        res.json(uniqueCrops);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req: any, res: Response) => {
    const userId = req.user.id;
    const productData = req.body;

    try {
        const farmer = await prisma.farmerProfile.findUnique({ where: { userId } });
        if (!farmer) return res.status(404).json({ message: 'Farmer profile not found' });

        const product = await prisma.product.create({
            data: {
                ...productData,
                farmerId: farmer.id,
                harvestDate: new Date(productData.harvestDate || new Date())
            }
        });

        res.status(201).json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleFollow = async (req: any, res: Response) => {
    const userId = req.user.id;
    const { farmerId } = req.body;

    try {
        const existing = await prisma.follower.findUnique({
            where: {
                userId_farmerId: { userId, farmerId }
            }
        });

        if (existing) {
            await prisma.follower.delete({ where: { id: existing.id } });
            return res.json({ followed: false });
        } else {
            await prisma.follower.create({
                data: { userId, farmerId }
            });
            return res.json({ followed: true });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
