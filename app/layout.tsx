import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GetHotels - Find Your Perfect Stay",
  description: "Discover and book hotels, tours, and travel packages worldwide with GetHotels",
  keywords: "hotels, tours, travel, booking, stay, destinations",
  authors: [{ name: "GetHotels" }],
  creator: "GetHotels",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gethotels.com",
    siteName: "GetHotels",
    title: "GetHotels - Find Your Perfect Stay",
    description: "Discover and book hotels, tours, and travel packages worldwide",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
