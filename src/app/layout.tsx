
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Auth0ProviderWithHistory from '@/components/auth/Auth0ProviderWithHistory';
import { AuthProvider } from '@/lib/auth-context';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'DealMate',
  description: 'Your smart shopping assistant for Indian e-commerce.',
  icons: {
    icon: '/Logo.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DealMate',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#8b5cf6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-body antialiased safe-area-inset-all`}>
        <Auth0ProviderWithHistory>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Auth0ProviderWithHistory>
      </body>
    </html>
  );
}
