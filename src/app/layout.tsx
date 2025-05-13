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
  description: "Chat with Daniel’s pixel-style AI twin in a retro 16-bit universe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-black text-white font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}