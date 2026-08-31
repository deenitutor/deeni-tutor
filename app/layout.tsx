import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth/AuthContext';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import BottomNav from '@/components/shared/BottomNav';

export const metadata: Metadata = {
  title: 'Deeni Tutor — Online Arabic & Quran Tutoring Marketplace',
  description: 'Learn Arabic from qualified Bangladeshi teachers — online, affordably, and flexibly. Authentic Dars-e-Nizami & University scholars.',
  openGraph: {
    title: 'Deeni Tutor — Online Arabic & Quran Tutoring Marketplace',
    description: 'Learn Arabic from qualified Bangladeshi teachers — online, affordably, and flexibly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deeni Tutor — Online Arabic & Quran Tutoring Marketplace',
    description: 'Learn Arabic from qualified Bangladeshi teachers — online, affordably, and flexibly.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-[#16202A] antialiased" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}

