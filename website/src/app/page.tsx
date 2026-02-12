import Link from 'next/link';
import FundraisingProgress from '@/components/FundraisingProgress';
import PlayerCard from '@/components/PlayerCard';
import playersData from '@/data/players.json';

export default function Home() {
  const { players, fundraising, team } = playersData;
  const featuredPlayers = players.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background with diagonal stripes effect */}
        <div className="absolute inset-0 gradient-animate" />
        <div className="absolute inset-0 diagonal-stripes" />

        {/* Animated glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CC0000] rounded-full filter blur-[150px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#CC0000] rounded-full filter blur-[100px] opacity-15 animate-pulse delay-1000" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Heading */}
          <h1 className="font-display text-7xl md:text-8xl lg:text-9xl text-white mb-4 text-glow-red">
            CITI PIRATES
          </h1>

          <p className="font-display text-2xl md:text-3xl text-[#CC0000] tracking-[0.3em] mb-6">
            12U BASEBALL
          </p>

          <p className="text-xl md:text-2xl text-[#888] max-w-2xl mx-auto mb-8">
            San Francisco&apos;s finest youth athletes on a mission to conquer
            <span className="text-white font-semibold"> Cooperstown</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ding-a-thon" className="btn-primary text-xl px-8 py-4">
              SUPPORT OUR JOURNEY
            </Link>
            <Link href="/roster" className="btn-secondary text-xl px-8 py-4">
              MEET THE TEAM
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <svg
            className="w-8 h-8 text-[#CC0000]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Fundraising Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#CC0000] font-display text-lg tracking-wider block mb-3">
                OUR MISSION
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                ROAD TO <span className="text-glow-red">COOPERSTOWN</span>
              </h2>
              <p className="text-[#888] text-lg leading-relaxed mt-8">
                Every summer, the best youth baseball teams from across the
                nation gather at{' '}
                <span className="text-white">Cooperstown All-Star Village</span> for
                a week of competition, camaraderie, and unforgettable memories.
              </p>
              <p className="text-[#888] text-lg leading-relaxed mt-4">
                Help us give these 12 young athletes the experience of a
                lifetime. Your support covers travel, lodging, tournament fees,
                and equipment.
              </p>
              <Link
                href="/fundraising"
                className="btn-primary inline-block mt-8"
              >
                LEARN MORE & DONATE
              </Link>
            </div>

            <div className="bg-[#141414] p-8 rounded-lg border border-[#333]">
              <h3 className="font-display text-2xl text-white mb-6">
                FUNDRAISING PROGRESS
              </h3>
              <FundraisingProgress
                raised={fundraising.raised}
                goal={fundraising.goal}
                size="lg"
              />

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="stat-box rounded">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Players</div>
                </div>
                <div className="stat-box rounded">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Dream</div>
                </div>
                <div className="stat-box rounded">
                  <div className="stat-value">&apos;26</div>
                  <div className="stat-label">Summer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section - commented out for now
      <section className="py-12 bg-[#0F0F0F] border-y border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-[#CC0000] font-display text-lg tracking-wider block mb-3">
              OUR SPONSORS
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-white mb-6">
              COMING SOON
            </h2>
            <p className="text-[#888] max-w-xl mx-auto">
              We&apos;re grateful to our sponsors who help make this journey possible.
              Interested in supporting the team? <Link href="/fundraising" className="text-[#CC0000] hover:underline">Get in touch</Link>.
            </p>
            <div className="flex justify-center gap-8 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-[#1A1A1A] rounded-lg border border-[#333] flex items-center justify-center"
                >
                  <span className="text-[#444] text-2xl">?</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Featured Players Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#CC0000] font-display text-lg tracking-wider block mb-3">
              THE SQUAD
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              MEET THE <span className="text-glow-red">PLAYERS</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/roster" className="btn-secondary">
              VIEW FULL ROSTER
            </Link>
          </div>
        </div>
      </section>

      {/* Cooperstown Info Section */}
      <section className="py-20 bg-[#0A0A0A] relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#CC0000]/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-[#141414] p-8 rounded-lg border border-[#333] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#CC0000]" />
                <h3 className="font-display text-3xl text-white mb-4">
                  COOPERSTOWN ALL-STAR VILLAGE
                </h3>
                <p className="text-[#888] leading-relaxed mb-4">
                  Located in Cooperstown, New York - the birthplace of baseball
                  - All-Star Village hosts over 100 teams each week during summer
                  tournaments.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#CC0000] rounded-full" />
                    <span className="text-[#888]">
                      Week-long tournament experience
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#CC0000] rounded-full" />
                    <span className="text-[#888]">
                      Stay in authentic team barracks
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#CC0000] rounded-full" />
                    <span className="text-[#888]">
                      Trading pins tradition
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#CC0000] rounded-full" />
                    <span className="text-[#888]">
                      Play under the lights
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="text-[#CC0000] font-display text-lg tracking-wider">
                THE DESTINATION
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-4 mb-6">
                WHERE <span className="text-glow-red">LEGENDS</span>
                <br />
                ARE MADE
              </h2>
              <p className="text-[#888] text-lg leading-relaxed">
                For over 25 years, Cooperstown All-Star Village has been the premier
                destination for elite youth baseball. It&apos;s more than a
                tournament - it&apos;s a rite of passage.
              </p>
              <p className="text-[#888] text-lg leading-relaxed mt-4">
                In {team.tournamentDate}, the {team.name} will join teams from
                across the nation to compete, grow, and create memories that
                last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#990000] to-[#CC0000] relative overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-6xl text-white mb-6">
            BE PART OF THE JOURNEY
          </h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            Every donation brings us closer to Cooperstown. Every dollar helps a
            young player chase their dream.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ding-a-thon"
              className="bg-white text-[#CC0000] font-display text-xl px-8 py-4 hover:bg-[#CC0000] hover:text-white transition-colors"
            >
              DONATE TODAY
            </Link>
            {/* BECOME A SPONSOR — commented out for now
            <Link
              href="/sponsors"
              className="border-2 border-white text-white font-display text-xl px-8 py-4 hover:bg-white hover:text-[#CC0000] transition-colors"
            >
              BECOME A SPONSOR
            </Link>
            */}
          </div>
        </div>
      </section>
    </div>
  );
}
