import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Citi Pirates 12U Baseball | Cooperstown 2026',
  description:
    'Support the Citi Pirates 12U Baseball team on their journey to Cooperstown All-Star Village. Help us reach our $35,000 fundraising goal!',
  keywords: [
    'baseball',
    'youth baseball',
    '12U',
    'Cooperstown',
    'San Francisco',
    'Citi Pirates',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
