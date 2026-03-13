import QRCode from 'qrcode';

export const generateFarmerQR = async (slug: string): Promise<string> => {
    // The link that the QR code will open
    const profileUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/farmers/${slug}`;

    try {
        // Generate a Data URL (base64) for the QR code
        const qrDataUrl = await QRCode.toDataURL(profileUrl, {
            color: {
                dark: '#10b981', // primary color
                light: '#ffffff'
            },
            width: 400,
            margin: 2
        });

        return qrDataUrl;
    } catch (err) {
        console.error('QR Generation Error:', err);
        throw new Error('Could not generate QR code');
    }
};
