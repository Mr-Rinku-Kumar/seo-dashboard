// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SEO Dashboard',
  description: 'Manage your website SEO and content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            },
            success: {
              icon: '✅',
              style: {
                background: '#10b981',
                color: '#fff',
              },
            },
            error: {
              icon: '❌',
              style: {
                background: '#ef4444',
                color: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}