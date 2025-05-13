'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();

  const navItem = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-sm tracking-tight text-xs font-['Press_Start_2P'] transition-all
        ${pathname === href ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-800/40'}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-black/70 text-white px-4 py-3 flex justify-between items-center border-b border-gray-700 shadow-inner backdrop-blur-md">
      {/* Logo + Name */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/dm-logo.png"
          alt="dm-logo"
          width={24}
          height={24}
        />
        <span className="text-sm font-['Press_Start_2P'] tracking-tight text-white">Daniel Muljono</span>
      </Link>

      {/* Navigation */}
      <nav className="flex gap-2">
        {navItem('/', 'Chat')}
        {navItem('/about', 'About')}
        {navItem('/resume', 'Resume')}
      </nav>
    </header>
  );
}
