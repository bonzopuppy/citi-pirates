import Image from 'next/image';
import Link from 'next/link';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  position: string;
  image: string | null;
}

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link href={`/roster/${player.id}`}>
      <div className="player-card rounded-lg group cursor-pointer">
        {/* Player Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1A1A]">
          {player.image ? (
            <Image
              src={player.image}
              alt={`${player.firstName} ${player.lastName}`}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="jersey-number text-6xl opacity-30">
                  #{player.jerseyNumber}
                </div>
                <p className="text-[#666] text-sm mt-2">Photo coming soon</p>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />

          {/* Jersey Number Badge */}
          <div className="absolute top-3 right-3 bg-[#CC0000] px-3 py-1 rounded">
            <span className="font-display text-xl text-white">
              #{player.jerseyNumber}
            </span>
          </div>
        </div>

        {/* Player Info */}
        <div className="p-4">
          <h3 className="font-display text-2xl text-white group-hover:text-[#CC0000] transition-colors">
            {player.firstName} {player.lastName}
          </h3>
          <p className="text-[#888] text-sm uppercase tracking-wider">
            {player.position}
          </p>
        </div>
      </div>
    </Link>
  );
}
