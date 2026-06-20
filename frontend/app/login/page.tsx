// app/login/page.tsx
import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login - SEO Dashboard',
  description: 'Login to SEO Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}