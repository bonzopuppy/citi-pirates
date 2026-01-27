import Image from 'next/image';
import Link from 'next/link';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  position: string;
  image: string | null;
  cardImage?: string | null;
  cutoutImage?: string | null;
}

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  // Use cutout image path based on player id
  const cutoutPath = `/images/cutouts/${player.id}.png`;

  return (
    <Link href={`/roster/${player.id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-xl">
        <div className="relative aspect-[3/4] overflow-hidden card-container">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000] via-[#0a0a0a] to-[#1a0000]" />

          {/* Honeycomb pattern overlay */}
          <div className="absolute inset-0 honeycomb-pattern opacity-30" />

          {/* Diagonal lines accent */}
          <div className="absolute inset-0 diagonal-accent opacity-20" />

          {/* Red glow from bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#CC0000]/40 via-[#CC0000]/10 to-transparent" />

          {/* Side accent bars */}
          <div className="absolute top-4 bottom-4 left-0 w-1 bg-gradient-to-b from-transparent via-[#CC0000] to-transparent opacity-60" />
          <div className="absolute top-4 bottom-4 right-0 w-1 bg-gradient-to-b from-transparent via-[#CC0000] to-transparent opacity-60" />

          {/* Jersey number badge - top right */}
          <div className="absolute top-0 right-0 w-14 h-14 overflow-hidden rounded-bl-xl">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-bl from-[#990000] via-[#660000] to-[#330000]" />
            {/* Honeycomb texture overlay */}
            <div className="absolute inset-0 honeycomb-pattern opacity-40" />
            {/* Inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_-2px_2px_10px_rgba(0,0,0,0.6)]" />
            {/* Subtle border to blend */}
            <div className="absolute inset-0 border-l border-b border-[#CC0000]/30" />
            {/* Number - burned in effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Shadow layer for debossed look */}
              <span className="absolute font-display text-2xl text-black/40 translate-x-[1px] translate-y-[1px]">
                {player.jerseyNumber}
              </span>
              {/* Highlight layer */}
              <span className="absolute font-display text-2xl text-white/10 -translate-x-[1px] -translate-y-[1px]">
                {player.jerseyNumber}
              </span>
              {/* Main number */}
              <span className="font-display text-2xl text-[#220000] mix-blend-multiply">
                {player.jerseyNumber}
              </span>
            </div>
          </div>

          {/* Player cutout */}
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative w-[108%] h-[97%]">
              <Image
                src={cutoutPath}
                alt={`${player.firstName} ${player.lastName}`}
                fill
                className="object-contain object-bottom drop-shadow-[0_0_20px_rgba(204,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent pt-12 pb-3 px-3">
            {/* Position badge */}
            <div className="mb-1">
              <span className="text-[#CC0000] text-[10px] font-bold uppercase tracking-wider">
                {player.position}
              </span>
            </div>

            {/* Player name */}
            <h3 className="font-display text-xl text-white leading-tight group-hover:text-[#CC0000] transition-colors">
              {player.firstName}
              <br />
              <span className="text-2xl">{player.lastName}</span>
            </h3>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 border-2 border-[#CC0000]" />
            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(204,0,0,0.3)]" />
          </div>
        </div>
      </div>
    </Link>
  );
}
