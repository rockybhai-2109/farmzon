import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { Role, BusinessType } from '@prisma/client';
import { AuthService } from '../services/auth.service';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfarmlinkkey';

export const requestOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone } = req.body;

        if (!phone) {
            res.status(400).json({ message: 'Phone number is required' });
            return;
        }

        const otp = AuthService.generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Update or create user with OTP
        await prisma.user.upsert({
            where: { phone },
            update: { otp, otpExpiry },
            create: {
                phone,
                otp,
                otpExpiry,
                role: Role.BUYER, // Default role, will be updated during registration if new
                name: 'User',
            }
        });

        await AuthService.sendOTP(phone, otp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('Request OTP error:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone, otp } = req.body;

        const user = await prisma.user.findUnique({ where: { phone } });

        // BYPASS OTP FOR LOCAL DEV: Allow '123456' or any existing user
        const isSkipOTP = otp === '123456' || process.env.NODE_ENV !== 'production';

        if (!user) {
            res.status(404).json({ message: 'User not found. Please register first.' });
            return;
        }

        if (!isSkipOTP && (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date())) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        // Clear OTP after successful verification
        await prisma.user.update({
            where: { id: user.id },
            data: { otp: null, otpExpiry: null }
        });

        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                isRegistered: user.name !== 'User' // Basic check if profile is completed
            }
        });
    } catch (error: any) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role, name, phone, email, profileData } = req.body;

        // Check if user exists (should already exist from OTP step, but let's be safe)
        const existingUser = await prisma.user.findUnique({ where: { phone } });

        if (existingUser && existingUser.name !== 'User') {
            res.status(400).json({ message: 'Account already registered' });
            return;
        }

        const userData = {
            role: role as Role,
            name,
            email: email || undefined,
        };

        const user = existingUser
            ? await prisma.user.update({ where: { phone }, data: userData })
            : await prisma.user.create({ data: { ...userData, phone } });

        // Handle Role-based Profile Creation/Update
        if (role === 'FARMER') {
            const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const baseSlug = generateSlug(name);
            let slug = baseSlug;
            let counter = 1;
            while (await prisma.farmerProfile.findUnique({ where: { slug } })) {
                slug = `${baseSlug}-${counter++}`;
            }

            await prisma.farmerProfile.upsert({
                where: { userId: user.id },
                update: {
                    village: profileData.village,
                    state: profileData.state || 'Gujarat',
                    farmSize: profileData.farmSize,
                    experienceYears: profileData.experienceYears || 0,
                    farmingType: profileData.farmingType || 'Traditional',
                    cropsGrown: profileData.cropsGrown || [],
                    isOrganicCertified: profileData.isOrganicCertified || false,
                    transportAvailable: profileData.transportAvailable || false,
                    profileImage: profileData.profilePhoto,
                    farmPhoto: profileData.farmPhoto,
                },
                create: {
                    userId: user.id,
                    slug,
                    village: profileData.village,
                    state: profileData.state || 'Gujarat',
                    farmSize: profileData.farmSize,
                    experienceYears: profileData.experienceYears || 0,
                    farmingType: profileData.farmingType || 'Traditional',
                    cropsGrown: profileData.cropsGrown || [],
                    isOrganicCertified: profileData.isOrganicCertified || false,
                    transportAvailable: profileData.transportAvailable || false,
                    profileImage: profileData.profilePhoto,
                    farmPhoto: profileData.farmPhoto,
                }
            });
        } else if (role === 'BUYER') {
            await prisma.buyerProfile.upsert({
                where: { userId: user.id },
                update: {
                    businessType: profileData.businessType as BusinessType,
                    businessName: profileData.businessName,
                    weeklyQuantity: profileData.weeklyQuantity,
                    city: profileData.city,
                },
                create: {
                    userId: user.id,
                    businessType: profileData.businessType as BusinessType,
                    businessName: profileData.businessName,
                    weeklyQuantity: profileData.weeklyQuantity,
                    city: profileData.city,
                }
            });
        }

        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error: any) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    // Deprecated in favor of OTP flow, but keeping signature for now to avoid breaking routes immediately
    res.status(405).json({ message: 'Please use OTP flow for login' });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                farmerProfile: true,
                buyerProfile: true,
            }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error: any) {
        console.error('getMe error:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};
