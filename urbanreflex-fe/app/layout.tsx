/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 19-11-2025
 * Description: Root layout component that wraps all pages with common elements like header, footer, and global styles
 */

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CanvasParticles from "@/components/ui/CanvasParticles";
import { AuthProvider } from "@/contexts/AuthContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "UrbanReflex - Fighting air inequality through open data",
  description: "UrbanReflex is a nonprofit organization providing universal access to air quality data to empower a global community of changemakers to solve air inequality.",
  keywords: ["air quality", "open data", "air pollution", "environmental data", "UrbanReflex"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased bg-white`}>
        <AuthProvider>
          <CanvasParticles
            className="fixed inset-0 w-full h-full"
            particleCount={60}
            particleColor="rgba(14, 165, 233, 0.6)"
            lineColor="rgba(14, 165, 233, 0.15)"
            particleSize={2.5}
            connectionDistance={120}
            speed={0.25}
          >
            <></>
          </CanvasParticles>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
