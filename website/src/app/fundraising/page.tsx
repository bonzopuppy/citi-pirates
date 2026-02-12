import Link from 'next/link';
import FundraisingProgress from '@/components/FundraisingProgress';
import playersData from '@/data/players.json';

export const metadata = {
  title: 'Support Our Journey | Citi Pirates 12U Baseball',
  description:
    'Help the Citi Pirates 12U Baseball team reach Cooperstown All-Star Village in Summer 2026. Your donation supports travel, lodging, and tournament fees.',
};

export default function FundraisingPage() {
  const { fundraising, team } = playersData;

  const supportItems = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      title: 'Travel',
      description: 'Flights and ground transportation for 12 players',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Lodging',
      description: 'Week-long stay at Cooperstown All-Star Village barracks',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Tournament Fees',
      description: 'Entry fees and registration for the week-long tournament',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: 'Team Equipment',
      description: 'Bats, balls, and training gear for practices and games',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: 'Uniforms & Gear',
      description: 'Team jerseys, hats, and player equipment',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Meals',
      description: 'Food and nutrition throughout the tournament week',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — combined Cooperstown + Ding-A-Thon pitch */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 gradient-animate" />
        <div className="absolute inset-0 diagonal-stripes" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#CC0000] rounded-full filter blur-[150px] opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            HELP US GET TO <span className="text-glow-red">COOPERSTOWN</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#888] max-w-2xl mx-auto mb-4">
            The {team.name} {team.ageGroup} are heading to{' '}
            <span className="text-white">{team.tournament}</span> in{' '}
            <span className="text-[#CC0000] font-semibold">{team.tournamentDate}</span>
          </p>
          <p className="text-lg md:text-xl text-[#888] max-w-xl mx-auto mb-10">
            Pledge per stat &mdash; every hit, run, and strikeout earns money for the team.
            Pick your player and set your pledges.
          </p>
          <Link
            href="/ding-a-thon"
            className="btn-primary inline-block text-center text-xl px-12 py-4"
          >
            MAKE YOUR PLEDGE
          </Link>
        </div>
      </section>

      {/* What Your Support Covers */}
      <section className="py-20 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#CC0000] font-display text-lg tracking-wider block mb-3">
              WHERE YOUR MONEY GOES
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              WHAT YOUR <span className="text-glow-red">SUPPORT</span> COVERS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportItems.map((item) => (
              <div
                key={item.title}
                className="bg-[#141414] p-6 rounded-lg border border-[#333] hover:border-[#CC0000] transition-colors"
              >
                <div className="text-[#CC0000] mb-4">{item.icon}</div>
                <h3 className="font-display text-xl text-white mb-2">{item.title}</h3>
                <p className="text-[#888]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fundraising Progress Section */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141414] p-8 md:p-12 rounded-lg border border-[#333]">
            <h2 className="font-display text-2xl md:text-3xl text-white text-center mb-8">
              FUNDRAISING PROGRESS
            </h2>
            <FundraisingProgress
              raised={fundraising.raised}
              goal={fundraising.goal}
              size="lg"
            />
          </div>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="py-20 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#CC0000] font-display text-lg tracking-wider block mb-3">
                THE JOURNEY
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                A <span className="text-glow-red">ONCE-IN-A-LIFETIME</span> EXPERIENCE
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-[#888] text-lg leading-relaxed">
                Cooperstown All-Star Village isn&apos;t just a tournament - it&apos;s where
                baseball dreams come alive. For over 25 years, it&apos;s been the ultimate
                destination for youth baseball players from across the nation.
              </p>
              <p className="text-[#888] text-lg leading-relaxed">
                Our 12 players will compete against elite teams, stay in authentic team
                barracks, trade pins with players from across the country, and play under
                the lights on fields that mirror the magic of professional stadiums.
              </p>
              <p className="text-[#888] text-lg leading-relaxed">
                This is the trip these kids will remember for the rest of their lives.
                <span className="text-white font-semibold"> Help us make it happen.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-r from-[#990000] to-[#CC0000] relative overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-5xl text-white mb-6">
            EVERY DOLLAR BRINGS US CLOSER TO COOPERSTOWN
          </h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            Meet the young athletes you&apos;re supporting on their journey to the birthplace of baseball.
          </p>
          <Link
            href="/roster"
            className="inline-block bg-white text-[#CC0000] font-display text-xl px-8 py-4 hover:bg-[#CC0000] hover:text-white transition-colors"
          >
            MEET THE PLAYERS
          </Link>
        </div>
      </section>

      {/* Sticky mobile CTA — always visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A0A0A]/95 backdrop-blur-sm border-t border-[#CC0000]/30 px-4 py-3">
        <Link
          href="/ding-a-thon"
          className="btn-primary block text-center text-lg py-3"
        >
          MAKE YOUR PLEDGE
        </Link>
      </div>

      {/* Spacer for sticky bar on mobile */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
