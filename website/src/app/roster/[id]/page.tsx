import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import playersData from '@/data/players.json';

interface PlayerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return playersData.players.map((player) => ({
    id: player.id,
  }));
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { id } = await params;
  const player = playersData.players.find((p) => p.id === id);

  if (!player) {
    return {
      title: 'Player Not Found | Citi Pirates',
    };
  }

  return {
    title: `${player.firstName} ${player.lastName} | Citi Pirates 12U`,
    description: `Meet ${player.firstName} ${player.lastName}, #${player.jerseyNumber} ${player.position} for the Citi Pirates 12U Baseball team.`,
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const player = playersData.players.find((p) => p.id === id);

  if (!player) {
    notFound();
  }

  const playerIndex = playersData.players.findIndex((p) => p.id === id);
  const prevPlayer = playerIndex > 0 ? playersData.players[playerIndex - 1] : null;
  const nextPlayer =
    playerIndex < playersData.players.length - 1
      ? playersData.players[playerIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#CC0000]/20 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/roster"
            className="inline-flex items-center gap-2 text-[#888] hover:text-[#CC0000] transition-colors mb-8"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Roster
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Player Image */}
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#141414] border border-[#333]">
                {player.image ? (
                  <Image
                    src={player.image}
                    alt={`${player.firstName} ${player.lastName}`}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="jersey-number text-8xl opacity-30">
                        #{player.jerseyNumber}
                      </div>
                      <p className="text-[#666] mt-4">Photo coming soon</p>
                    </div>
                  </div>
                )}

                {/* Jersey Number Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] to-transparent p-6">
                  <div className="jersey-number text-7xl md:text-8xl">
                    #{player.jerseyNumber}
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-4 border-[#CC0000] rounded-lg -z-10" />
            </div>

            {/* Player Info */}
            <div>
              <div className="mb-6">
                <span className="text-[#CC0000] font-display text-lg tracking-wider">
                  #{player.jerseyNumber} • {player.position.toUpperCase()}
                </span>
                <h1 className="font-display text-5xl md:text-7xl text-white mt-4 text-glow-red">
                  {player.firstName}
                  <br />
                  {player.lastName}
                </h1>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="stat-box rounded">
                  <div className="stat-label">Bats</div>
                  <div className="stat-value text-2xl">{player.battingHand}</div>
                </div>
                <div className="stat-box rounded">
                  <div className="stat-label">Throws</div>
                  <div className="stat-value text-2xl">{player.throwingHand}</div>
                </div>
              </div>

              {/* Fun Fact */}
              {player.funFact && player.funFact !== 'TBD' && (
                <div className="bg-[#141414] p-6 rounded-lg border border-[#333] mb-6">
                  <h3 className="font-display text-lg text-[#CC0000] mb-2">
                    FUN FACT
                  </h3>
                  <p className="text-white text-lg">{player.funFact}</p>
                </div>
              )}

              {/* Walk-Up Song */}
              {player.walkUpSong && player.walkUpSong.title && (
                <div className="bg-[#141414] p-6 rounded-lg border border-[#333] mb-6">
                  <h3 className="font-display text-lg text-[#CC0000] mb-2">
                    WALK-UP SONG
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#CC0000] rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {player.walkUpSong.title}
                        </p>
                        <p className="text-[#888]">{player.walkUpSong.artist}</p>
                      </div>
                    </div>
                    <a
                      href={player.walkUpSong.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(player.walkUpSong.title + ' ' + player.walkUpSong.artist)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#CC0000] hover:text-white transition-colors text-sm font-semibold"
                    >
                      Play on Spotify →
                    </a>
                  </div>
                </div>
              )}

              {/* Season Stats */}
              <div className="bg-[#141414] p-6 rounded-lg border border-[#333]">
                <h3 className="font-display text-lg text-[#CC0000] mb-4">
                  SEASON STATS
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">
                    <div className="font-display text-2xl md:text-3xl text-white">
                      {player.stats.battingAverage}
                    </div>
                    <div className="text-[#888] text-xs uppercase">AVG</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-2xl md:text-3xl text-white">
                      {player.stats.hits}
                    </div>
                    <div className="text-[#888] text-xs uppercase">H</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-2xl md:text-3xl text-white">
                      {player.stats.rbis}
                    </div>
                    <div className="text-[#888] text-xs uppercase">RBI</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-2xl md:text-3xl text-white">
                      {player.stats.runs}
                    </div>
                    <div className="text-[#888] text-xs uppercase">R</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-2xl md:text-3xl text-white">
                      {player.stats.stolenBases}
                    </div>
                    <div className="text-[#888] text-xs uppercase">SB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Player Navigation */}
      <section className="py-12 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {prevPlayer ? (
              <Link
                href={`/roster/${prevPlayer.id}`}
                className="group flex items-center gap-4"
              >
                <svg
                  className="w-6 h-6 text-[#888] group-hover:text-[#CC0000] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <div>
                  <span className="text-[#888] text-sm">Previous</span>
                  <p className="font-display text-xl text-white group-hover:text-[#CC0000] transition-colors">
                    {prevPlayer.firstName} {prevPlayer.lastName}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPlayer ? (
              <Link
                href={`/roster/${nextPlayer.id}`}
                className="group flex items-center gap-4 text-right"
              >
                <div>
                  <span className="text-[#888] text-sm">Next</span>
                  <p className="font-display text-xl text-white group-hover:text-[#CC0000] transition-colors">
                    {nextPlayer.firstName} {nextPlayer.lastName}
                  </p>
                </div>
                <svg
                  className="w-6 h-6 text-[#888] group-hover:text-[#CC0000] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-12 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl text-white mb-4">
            SUPPORT {player.firstName.toUpperCase()}&apos;S JOURNEY
          </h2>
          <p className="text-[#888] mb-6">
            Help send {player.firstName} and the entire Citi Pirates team to
            Cooperstown All-Star Village!
          </p>
          <Link href="/fundraising" className="btn-primary">
            DONATE NOW
          </Link>
        </div>
      </section>
    </div>
  );
}
