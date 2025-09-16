import './globals.css';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import HeaderSwitch from '@/components/HeaderSwitch'; // ⬅️ use the client-side switcher

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Daniel Muljono's",
  description: "Chat with Daniel’s pixel-style AI twin in a retro 16-bit universe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      {/* keep your global classes + add the Poppins font class */}
      <body className={`bg-black text-white font-sans antialiased ${poppins.className}`}>
        {/* Conditionally renders <Header /> except on /professional_resume */}
        <HeaderSwitch />
        {children}
      </body>
    </html>
  );
}
