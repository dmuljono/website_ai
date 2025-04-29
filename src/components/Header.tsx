'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItem = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-4 py-2 rounded hover:bg-gray-700 transition ${
        pathname === href ? 'bg-gray-800 text-white font-semibold' : 'text-gray-300'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-[#121212] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-blue-400">Daniel</h1>
      <nav className="flex gap-3">
        {navItem('/', 'Chat')}
        {navItem('/about', 'About Me')}
        {navItem('/resume', 'Resume')}
      </nav>
    </header>
  );
}
