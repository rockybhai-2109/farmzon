import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KisanMart — Buy Organic Vegetables Directly from Farmers | Wholesale",
  description: "India's #1 wholesale organic farmer marketplace. Connect with verified farmers, buy fresh vegetables in bulk at farm prices. No middlemen. 2,400+ farmers across 45 cities.",
  keywords: "organic vegetables near me, buy vegetables from farmers, wholesale vegetables online, farm fresh vegetables, direct from farm, KisanMart",
};

import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { TrackingProvider } from "@/context/TrackingContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LocationProvider } from "@/context/LocationContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageSelectionScreen } from "@/components/LanguageSelectionScreen";
import PageTransition from "@/components/PageTransition";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#3D2B1F" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;600;700;900&family=Noto+Sans+Devanagari:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <LanguageSelectionScreen />
            <InventoryProvider>
              <TrackingProvider>
                <LocationProvider>
                  <CartProvider>
                    <AuthProvider>
                      <PageTransition>
                        {children}
                      </PageTransition>
                      <Toaster />
                    </AuthProvider>
                  </CartProvider>
                </LocationProvider>
              </TrackingProvider>
            </InventoryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
