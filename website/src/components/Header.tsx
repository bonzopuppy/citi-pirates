'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

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
              className="object-contain object-left"
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
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="btn-primary text-base px-6 py-2"
            >
              DONATE NOW
            </button>
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
          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsDonateModalOpen(true);
            }}
            className="btn-primary text-center mt-4"
          >
            DONATE NOW
          </button>
        </nav>
      </div>

    </header>

      {/* Donate Modal - Outside header to avoid fixed positioning issues */}
      {isDonateModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsDonateModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative bg-[#0A0A0A] border border-[#333] rounded-lg max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsDonateModalOpen(false)}
              className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#CC0000]/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#CC0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="font-display text-3xl text-white mb-2">
                COMING <span className="text-glow-red">SOON</span>
              </h3>

              <p className="text-[#888] mb-6">
                Online donations will be available shortly.
              </p>

              <button
                onClick={() => setIsDonateModalOpen(false)}
                className="btn-secondary w-full"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
