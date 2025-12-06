import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UrbanReflex - Hệ Thống Giám Sát Đô Thị Thông Minh',
  description: 'Giám sát real-time thời tiết, chất lượng không khí, đèn đường và báo cáo công dân cho Thành phố Hồ Chí Minh. Tích hợp dữ liệu từ OpenWeatherMap và OpenAQ.',
  keywords: ['urban monitoring', 'smart city', 'air quality', 'weather', 'HCMC', 'IoT', 'real-time data'],
  authors: [{ name: 'UrbanReflex Team' }],
  openGraph: {
    title: 'UrbanReflex - Hệ Thống Giám Sát Đô Thị Thông Minh',
    description: 'Giám sát real-time cho Thành phố Hồ Chí Minh',
    type: 'website',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <LanguageProvider>
          <RootProvider>{children}</RootProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
