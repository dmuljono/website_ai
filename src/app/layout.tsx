import './globals.css';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import Header from '@/components/Header';

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Daniel's Digital Twin",
  description: 'Chat with Daniel’s AI twin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-black text-white`}>
        <Header />
        <main className="px-4 py-6 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
