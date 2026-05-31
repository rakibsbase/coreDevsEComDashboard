import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/store/ReduxProvider';

export const metadata: Metadata = {
  title: 'Core Devs Admin Panel',
  description: 'Pixel-perfect Next.js Admin Dashboard for Core Devs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg-app text-text-primary transition-colors duration-205">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
