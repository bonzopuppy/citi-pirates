'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/roster', label: 'Roster' },
    { href: '/fundraising', label: 'Fundraising' },
    { href: '/gallery', label: 'Gallery' },
  ];

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="relative w-[102px] h-8 md:w-36 md:h-10 hover:scale-105 transition-transform">
            <Image
              src="/images/citi-pirates-logo.avif"
              alt="Citi Pirates"
              fill
              className="object-contain object-left saturate-[1.4] contrast-[1.15] hue-rotate-[-10deg] brightness-[0.9]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-lg"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/ding-a-thon"
              className="btn-primary text-base px-6 py-2 inline-block"
            >
              DONATE NOW
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#0A0A0A]/98 backdrop-blur-sm border-b border-[#333] transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="flex flex-col px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-display text-xl text-white py-3 border-b border-[#222] hover:text-[#CC0000] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/ding-a-thon"
            onClick={() => setIsMenuOpen(false)}
            className="btn-primary text-center mt-4 inline-block"
          >
            DONATE NOW
          </Link>
        </nav>
      </div>

    </header>

    </>
  );
}
