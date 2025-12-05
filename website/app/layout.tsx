/**
 * ============================================================================
 * UrbanReflex — Smart City Intelligence Platform
 * Copyright (C) 2025  WAG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * For more information, visit: https://github.com/minhe51805/UrbanReflex
 * ============================================================================
 */

'use client';

import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CanvasParticles from "@/components/ui/CanvasParticles";
import FloatingChatButton from "@/components/ui/FloatingChatButton";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isExplorePage = pathname === '/explore';
  const isAdminPage = pathname === '/admin';

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
          {!isExplorePage && !isAdminPage && <Footer />}
          <FloatingChatButton />
        </AuthProvider>
      </body>
    </html>
  );
}

