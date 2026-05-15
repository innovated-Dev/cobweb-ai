import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CobWEB AI — Your Digital Setup Assistant',
  description:
    'CobWEB builds your WordPress or Shopify presence from scratch — the right theme, plugins, CRM, and automations, guided by AI.',
  keywords: ['WordPress setup', 'Shopify setup', 'AI website builder', 'CRM automation', 'productised service'],
  openGraph: {
    title: 'CobWEB AI — Your Digital Setup Assistant',
    description: 'Build your perfect digital presence, guided by AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-web-bg text-web-text font-body antialiased">
        {children}
      </body>
    </html>
  );
}
