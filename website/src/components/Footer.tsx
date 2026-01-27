import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#333] mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="font-display text-xl text-white hover:text-[#CC0000] transition-colors mb-4 inline-block section-header">
              CITI PIRATES 12U
            </Link>
            <p className="text-[#888] text-sm leading-relaxed mt-6">
              San Francisco&apos;s finest 12U baseball team, heading to
              Cooperstown All-Star Village in Summer 2026.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-white mb-4 section-header">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 mt-6">
              <li>
                <Link
                  href="/"
                  className="text-[#888] hover:text-[#CC0000] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/roster"
                  className="text-[#888] hover:text-[#CC0000] transition-colors"
                >
                  Meet the Team
                </Link>
              </li>
              <li>
                <Link
                  href="/fundraising"
                  className="text-[#888] hover:text-[#CC0000] transition-colors"
                >
                  Support Us
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-[#888] hover:text-[#CC0000] transition-colors"
                >
                  Photo Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* The Mission */}
          <div>
            <h4 className="font-display text-lg text-white mb-4 section-header">
              THE MISSION
            </h4>
            <p className="text-[#888] text-sm leading-relaxed mt-6">
              Help us raise $35,000 to send our team to the prestigious
              Cooperstown All-Star Village tournament - a once-in-a-lifetime
              experience for our young athletes.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-white mb-4 section-header">
              GET IN TOUCH
            </h4>
            <ul className="space-y-2 mt-6 text-[#888] text-sm">
              <li>San Francisco, CA</li>
              <li>
                <a
                  href="mailto:xlevelsports@gmail.com"
                  className="hover:text-[#CC0000] transition-colors"
                >
                  xlevelsports@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#666] text-sm">
              &copy; {new Date().getFullYear()} Citi Pirates 12U Baseball. All
              rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[#CC0000] font-display text-sm tracking-wider">
                COOPERSTOWN 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
