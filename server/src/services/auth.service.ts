export class AuthService {
    static generateOTP(): string {
        // Generate a 6-digit OTP
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    static async sendOTP(phone: string, otp: string): Promise<boolean> {
        // In a real application, you would use an SMS gateway like Twilio, Msg91, etc.
        console.log(`[AUTH SERVICE] Sending OTP ${otp} to ${phone}`);
        return true;
    }
}
