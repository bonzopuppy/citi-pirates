import PlayerCard from '@/components/PlayerCard';
import playersData from '@/data/players.json';

export const metadata = {
  title: 'Roster | Citi Pirates 12U Baseball',
  description: 'Meet the 13 players of the Citi Pirates 12U Baseball team heading to Cooperstown All-Star Village in Summer 2026.',
};

export default function RosterPage() {
  const { players, team } = playersData;

  // Group players by position type
  const pitchers = players.filter(p => p.position === 'Pitcher');
  const catchers = players.filter(p => p.position === 'Catcher');
  const infielders = players.filter(p =>
    ['First Base', 'Second Base', 'Third Base', 'Shortstop'].includes(p.position)
  );
  const outfielders = players.filter(p =>
    ['Left Field', 'Center Field', 'Right Field'].includes(p.position)
  );
  const utility = players.filter(p => p.position === 'Utility');

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#CC0000]/20 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#CC0000] font-display text-lg tracking-wider">
            {team.name.toUpperCase()}
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white mt-4 mb-4 text-glow-red">
            THE ROSTER
          </h1>
          <p className="text-[#888] text-xl max-w-2xl mx-auto">
            13 athletes. One goal. Meet the players heading to Cooperstown All-Star Village in {team.tournamentDate}.
          </p>
        </div>
      </section>

      {/* Full Roster Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      </section>

      {/* Position Breakdown */}
      <section className="py-16 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-white">
              BY POSITION
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pitchers */}
            <div className="bg-[#141414] p-6 rounded-lg border border-[#333]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#CC0000] rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeWidth="2" d="M12 2C7 7 7 17 12 22M12 2c5 5 5 15 0 20" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-white">PITCHERS</h3>
              </div>
              <ul className="space-y-2">
                {pitchers.map(p => (
                  <li key={p.id} className="flex justify-between text-[#888]">
                    <span>{p.firstName} {p.lastName}</span>
                    <span className="text-[#CC0000]">#{p.jerseyNumber}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Catchers */}
            <div className="bg-[#141414] p-6 rounded-lg border border-[#333]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#CC0000] rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-white">CATCHERS</h3>
              </div>
              <ul className="space-y-2">
                {catchers.map(p => (
                  <li key={p.id} className="flex justify-between text-[#888]">
                    <span>{p.firstName} {p.lastName}</span>
                    <span className="text-[#CC0000]">#{p.jerseyNumber}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Infielders */}
            <div className="bg-[#141414] p-6 rounded-lg border border-[#333]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#CC0000] rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 12l10 10 10-10L12 2zm0 3l7 7-7 7-7-7 7-7z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-white">INFIELDERS</h3>
              </div>
              <ul className="space-y-2">
                {infielders.map(p => (
                  <li key={p.id} className="flex justify-between text-[#888]">
                    <span>{p.firstName} {p.lastName}</span>
                    <span className="text-[#CC0000]">#{p.jerseyNumber}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outfielders */}
            <div className="bg-[#141414] p-6 rounded-lg border border-[#333]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#CC0000] rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-white">OUTFIELDERS</h3>
              </div>
              <ul className="space-y-2">
                {outfielders.map(p => (
                  <li key={p.id} className="flex justify-between text-[#888]">
                    <span>{p.firstName} {p.lastName}</span>
                    <span className="text-[#CC0000]">#{p.jerseyNumber}</span>
                  </li>
                ))}
                {utility.map(p => (
                  <li key={p.id} className="flex justify-between text-[#888]">
                    <span>{p.firstName} {p.lastName}</span>
                    <span className="text-[#CC0000]">#{p.jerseyNumber}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Stats Preview */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#141414] to-[#1A1A1A] p-8 md:p-12 rounded-lg border border-[#333] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#CC0000]/10 to-transparent" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl text-white mb-8">
                TEAM STATS
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="font-display text-4xl md:text-5xl text-[#CC0000]">13</div>
                  <div className="text-[#888] text-sm uppercase tracking-wider mt-1">Players</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-4xl md:text-5xl text-white">12U</div>
                  <div className="text-[#888] text-sm uppercase tracking-wider mt-1">Division</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-4xl md:text-5xl text-white">SF</div>
                  <div className="text-[#888] text-sm uppercase tracking-wider mt-1">Location</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-4xl md:text-5xl text-[#CC0000]">&apos;26</div>
                  <div className="text-[#888] text-sm uppercase tracking-wider mt-1">Season</div>
                </div>
                <div className="text-center relative">
                  <div className="absolute inset-0 -inset-x-2 -inset-y-3 bg-[#CC0000]/20 border border-[#CC0000] rounded-lg" />
                  <div className="relative font-display text-4xl md:text-5xl text-white">1</div>
                  <div className="relative text-white text-sm uppercase tracking-wider mt-1">Dream</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
