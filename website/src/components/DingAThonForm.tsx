'use client';

import { useState, useMemo, useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';
import Image from 'next/image';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SeasonStats2025 {
  singles: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  runsScored: number;
  rbis: number;
  stolenBases: number;
  strikeouts: number;
  defensiveOuts: number;
  infieldAssists: number;
  outfieldAssists: number;
  doublePlays: number;
}

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  position: string;
  positions?: string[];
  image: string;
  seasonStats2025?: SeasonStats2025;
}

function positionAbbrev(position: string): string {
  switch (position) {
    case 'Pitcher': return 'P';
    case 'Catcher': return 'C';
    case 'First Base':
    case 'Second Base':
    case 'Third Base':
    case 'Shortstop':
    case 'Infield': return 'INF';
    case 'Left Field':
    case 'Center Field':
    case 'Right Field':
    case 'Outfield': return 'OF';
    default: return position;
  }
}

function positionLabel(player: Player): string {
  const abbrevs = [positionAbbrev(player.position)];
  if (player.positions) {
    for (const pos of player.positions) {
      const a = positionAbbrev(pos);
      if (!abbrevs.includes(a)) abbrevs.push(a);
    }
  }
  return abbrevs.join(' / ');
}

interface DingAThonFormProps {
  players: Player[];
}

/* ------------------------------------------------------------------ */
/*  Stat category metadata                                             */
/* ------------------------------------------------------------------ */

const STAT_CATEGORIES: { key: keyof SeasonStats2025; label: string; emoji: string; description: string }[] = [
  { key: 'singles', label: 'Singles', emoji: '1B', description: '1-base hit' },
  { key: 'doubles', label: 'Doubles', emoji: '2B', description: '2-base hit' },
  { key: 'triples', label: 'Triples', emoji: '3B', description: '3-base hit' },
  { key: 'homeRuns', label: 'Home Runs', emoji: 'HR', description: '4-bagger' },
  { key: 'runsScored', label: 'Runs Scored', emoji: 'R', description: 'Crossed home plate' },
  { key: 'rbis', label: 'RBIs', emoji: 'RBI', description: 'Runs batted in' },
  { key: 'stolenBases', label: 'Stolen Bases', emoji: 'SB', description: 'Stolen base' },
  { key: 'strikeouts', label: 'Strikeouts', emoji: 'K', description: 'Pitched strikeout' },
  { key: 'defensiveOuts', label: 'Defensive Outs', emoji: 'DO', description: 'Caught or fielded' },
  { key: 'infieldAssists', label: 'Infield Assists', emoji: 'IA', description: 'Infield assist' },
  { key: 'outfieldAssists', label: 'Outfield Assists', emoji: 'OA', description: 'Outfield assist' },
  { key: 'doublePlays', label: 'Double Plays', emoji: 'DP', description: 'Double play' },
];

const DEFAULT_STATS: SeasonStats2025 = {
  singles: 0, doubles: 0, triples: 0, homeRuns: 0,
  runsScored: 0, rbis: 0, stolenBases: 0, strikeouts: 0,
  defensiveOuts: 0, infieldAssists: 0, outfieldAssists: 0, doublePlays: 0,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DingAThonForm({ players }: DingAThonFormProps) {
  const posthog = usePostHog();

  // Steps: 0=intro+player, 1=pledges, 2=info+cap, 3=review, 4=confirmation
  const [step, setStep] = useState(0);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [pledges, setPledges] = useState<Record<string, number>>({});
  const [supporter, setSupporter] = useState({ name: '', email: '', phone: '' });
  const [cap, setCap] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Funnel event: page viewed
  useEffect(() => {
    posthog?.capture('dingathon_page_viewed');
  }, [posthog]);

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);
  const playerStats = selectedPlayer?.seasonStats2025 || DEFAULT_STATS;
  const hasAnyStats = Object.values(playerStats).some((v) => v > 0);

  // Live estimated total
  const estimatedTotal = useMemo(() => {
    let total = 0;
    for (const cat of STAT_CATEGORIES) {
      const pledgeAmt = pledges[cat.key] || 0;
      const statCount = playerStats[cat.key] || 0;
      total += pledgeAmt * statCount;
    }
    return total;
  }, [pledges, playerStats]);

  const effectiveTotal = useMemo(() => {
    const capNum = parseFloat(cap);
    if (capNum > 0 && estimatedTotal > capNum) return capNum;
    return estimatedTotal;
  }, [estimatedTotal, cap]);

  const nonZeroPledges = STAT_CATEGORIES.filter((c) => (pledges[c.key] || 0) > 0);

  /* ---- Handlers ---- */

  const handlePledgeChange = (key: string, value: string) => {
    const num = parseFloat(value);
    setPledges((prev) => ({ ...prev, [key]: isNaN(num) || num < 0 ? 0 : num }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/ding-a-thon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: selectedPlayerId,
          supporter,
          pledges,
          cap: parseFloat(cap) || null,
          estimatedTotal: effectiveTotal,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      posthog?.capture('dingathon_submitted', {
        player_id: selectedPlayerId,
        player_name: `${selectedPlayer?.firstName} ${selectedPlayer?.lastName}`,
        estimated_total: effectiveTotal,
        num_pledges: nonZeroPledges.length,
        has_cap: !!(parseFloat(cap) > 0),
      });
      setStep(4);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- Validation ---- */
  const canProceedStep0 = !!selectedPlayerId;
  const canProceedStep1 = nonZeroPledges.length > 0;
  const canProceedStep2 = supporter.name.trim() && supporter.email.trim() && supporter.phone.trim();

  /* ------------------------------------------------------------------ */
  /*  Step Progress Bar                                                  */
  /* ------------------------------------------------------------------ */

  const stepLabels = ['Player', 'Pledges', 'Your Info', 'Review'];

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-10">
      {stepLabels.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <button
            onClick={() => { if (i < step) setStep(i); }}
            disabled={i >= step}
            className={`flex items-center gap-2 transition-all ${
              i < step ? 'cursor-pointer' : i === step ? 'cursor-default' : 'cursor-default opacity-40'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-sm transition-all ${
                i < step
                  ? 'bg-[#CC0000] text-white'
                  : i === step
                    ? 'bg-[#CC0000] text-white ring-2 ring-[#CC0000]/50 ring-offset-2 ring-offset-[#0A0A0A]'
                    : 'bg-[#1A1A1A] text-[#555] border border-[#333]'
              }`}
            >
              {i < step ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`hidden sm:inline font-display text-sm tracking-wider ${
                i <= step ? 'text-white' : 'text-[#555]'
              }`}
            >
              {label}
            </span>
          </button>
          {i < stepLabels.length - 1 && (
            <div className={`w-8 md:w-12 h-0.5 ${i < step ? 'bg-[#CC0000]' : 'bg-[#333]'}`} />
          )}
        </div>
      ))}
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Step 0: Intro + Player Select                                     */
  /* ------------------------------------------------------------------ */

  if (step === 0) {
    return (
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 gradient-animate" />
          <div className="absolute inset-0 diagonal-stripes" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#CC0000] rounded-full filter blur-[150px] opacity-20" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#CC0000] rounded-full filter blur-[120px] opacity-15" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[#CC0000] font-display text-lg md:text-xl tracking-wider block mb-4">
              CITI PIRATES 12U FUNDRAISER
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6">
              DING-A-<span className="text-glow-red">THON</span>
            </h1>
            <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-8">
              Pick a player and pledge a dollar amount for each key play during the
              Pirates&apos; spring season (Feb 28 &ndash; May 9). At the end of the season,
              we&apos;ll tally the stats and calculate your total donation.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-[#888]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#CC0000]" />
                20 Games
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#CC0000]" />
                12 Stat Categories
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#CC0000]" />
                680 Diablo League
              </div>
            </div>
          </div>
        </section>

        {/* Player Select */}
        <section className="py-16 bg-[#0F0F0F]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-[#CC0000] font-display text-lg tracking-wider block mb-3">STEP 1</span>
              <h2 className="font-display text-3xl md:text-4xl text-white">
                CHOOSE YOUR <span className="text-glow-red">PLAYER</span>
              </h2>
              <p className="text-[#888] mt-3">Select the player you want to support</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {players.map((player) => {
                const isSelected = selectedPlayerId === player.id;
                const cutoutPath = `/images/cutouts/${player.id}.png`;

                return (
                  <button
                    key={player.id}
                    onClick={() => {
                      setSelectedPlayerId(player.id);
                      posthog?.capture('dingathon_player_selected', {
                        player_id: player.id,
                        player_name: `${player.firstName} ${player.lastName}`,
                      });
                    }}
                    className={`relative group text-left rounded-lg overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-[#CC0000] ring-offset-2 ring-offset-[#0F0F0F] scale-[1.01]'
                        : 'hover:scale-[1.01]'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-4 bg-[#141414] border transition-all duration-300 rounded-lg overflow-hidden pr-4 ${
                        isSelected
                          ? 'border-[#CC0000]'
                          : 'border-[#333] hover:border-[#CC0000]/50'
                      }`}
                    >
                      {/* Cutout image */}
                      <div className="relative w-20 h-24 shrink-0 overflow-hidden">
                        {/* Subtle gradient bg behind cutout */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000] via-[#0a0a0a] to-[#1a0000]" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#CC0000]/20 to-transparent" />
                        <div className="absolute inset-0 flex items-end justify-center">
                          <div className="relative w-[115%] h-[95%]">
                            <Image
                              src={cutoutPath}
                              alt={`${player.firstName} ${player.lastName}`}
                              fill
                              className="object-contain object-bottom drop-shadow-[0_0_8px_rgba(204,0,0,0.3)]"
                              sizes="80px"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Player info */}
                      <div className="flex-1 min-w-0 py-3">
                        <p className="font-display text-xl text-white leading-tight group-hover:text-[#CC0000] transition-colors">
                          {player.firstName} {player.lastName}
                        </p>
                        <p className="text-xs text-[#888] mt-1">
                          <span className="text-[#CC0000] font-display">#{player.jerseyNumber}</span>
                          {' '}&middot;{' '}{positionLabel(player)}
                        </p>
                      </div>

                      {/* Selected indicator */}
                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="bg-[#CC0000] rounded-full w-8 h-8 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-[#333] group-hover:border-[#CC0000]/50 transition-colors" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Next button — sticky on mobile once a player is selected */}
            <div
              className={`mt-10 text-center sm:static ${
                canProceedStep0
                  ? 'sticky bottom-0 bg-[#0F0F0F]/95 backdrop-blur-sm -mx-4 px-4 py-4 border-t border-[#333] sm:bg-transparent sm:backdrop-blur-none sm:border-t-0 sm:mx-0 sm:px-0 sm:py-0'
                  : ''
              }`}
            >
              <button
                onClick={() => setStep(1)}
                disabled={!canProceedStep0}
                className={`btn-primary px-10 py-3 w-full sm:w-auto ${
                  !canProceedStep0 ? 'opacity-30 cursor-not-allowed !transform-none' : ''
                }`}
              >
                {selectedPlayer
                  ? `PLEDGE FOR ${selectedPlayer.firstName.toUpperCase()}`
                  : 'SELECT A PLAYER TO CONTINUE'}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Step 1: Pledge Amounts                                            */
  /* ------------------------------------------------------------------ */

  if (step === 1) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepIndicator />

          <div className="text-center mb-10">
            <span className="text-[#CC0000] font-display text-lg tracking-wider block mb-3">STEP 2</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
              SET YOUR <span className="text-glow-red">PLEDGES</span>
            </h2>
            <p className="text-[#888]">
              How much per play for <span className="text-white font-semibold">{selectedPlayer?.firstName} {selectedPlayer?.lastName}</span>?
              <br />
              Leave blank for categories you don&apos;t want to pledge.
            </p>
          </div>

          {/* Stat grid */}
          <div className="space-y-3">
            {STAT_CATEGORIES.map((cat) => {
              const lastYearStat = playerStats[cat.key] || 0;
              const pledgeAmt = pledges[cat.key] || 0;
              const lineTotal = pledgeAmt * lastYearStat;

              return (
                <div
                  key={cat.key}
                  className="bg-[#141414] border border-[#333] rounded-lg p-4 flex items-center gap-4 hover:border-[#CC0000]/50 transition-colors"
                >
                  {/* Stat badge */}
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-[#333] rounded flex items-center justify-center font-display text-[#CC0000] text-sm shrink-0">
                    {cat.emoji}
                  </div>

                  {/* Label + description */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg text-white leading-tight">{cat.label}</p>
                    <p className="text-xs text-[#666]">{cat.description}</p>
                    <p className="text-xs text-[#555] mt-1">
                      2025 season: <span className="text-[#888]">{lastYearStat > 0 ? lastYearStat : '—'}</span>
                    </p>
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#888] font-display text-lg">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      placeholder="0"
                      value={pledges[cat.key] || ''}
                      onChange={(e) => handlePledgeChange(cat.key, e.target.value)}
                      className="w-20 bg-[#0A0A0A] border border-[#333] rounded px-3 py-2 text-white text-right font-display text-lg focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Line total */}
                  <div className="w-20 text-right shrink-0 hidden sm:block">
                    {lineTotal > 0 && (
                      <p className="text-[#CC0000] font-display text-lg">
                        ${lineTotal.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Total — sticky on mobile */}
          <div className="sticky bottom-0 mt-6 bg-[#0A0A0A]/95 backdrop-blur-sm border-t border-[#333] -mx-4 px-4 py-4 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-t-0 sm:mx-0 sm:px-0 sm:py-0 sm:mt-8">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141414] border-2 border-[#CC0000] rounded-lg p-6 text-center">
              <p className="text-[#888] font-display text-sm tracking-wider mb-2">ESTIMATED SEASON TOTAL</p>
              {hasAnyStats ? (
                <>
                  <p className="font-display text-5xl text-white text-glow-red">
                    ${estimatedTotal.toFixed(2)}
                  </p>
                  <p className="text-xs text-[#555] mt-2">
                    Based on {selectedPlayer?.firstName}&apos;s 2025 stats
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-3xl text-white text-glow-red mt-1">
                    TBD
                  </p>
                  <p className="text-xs text-[#888] mt-2">
                    {selectedPlayer?.firstName}&apos;s stats will update as the season progresses.
                    <br />
                    Your total will be calculated from actual game results.
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1">
                BACK
              </button>
              <button
                onClick={() => {
                  posthog?.capture('dingathon_pledges_set', {
                    player_id: selectedPlayerId,
                    num_pledges: nonZeroPledges.length,
                    estimated_total: estimatedTotal,
                  });
                  setStep(2);
                }}
                disabled={!canProceedStep1}
                className={`btn-primary flex-1 ${
                  !canProceedStep1 ? 'opacity-30 cursor-not-allowed !transform-none' : ''
                }`}
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Step 2: Supporter Info + Cap                                      */
  /* ------------------------------------------------------------------ */

  if (step === 2) {
    const capNum = parseFloat(cap);
    const hasCap = !isNaN(capNum) && capNum > 0;

    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepIndicator />

          <div className="text-center mb-10">
            <span className="text-[#CC0000] font-display text-lg tracking-wider block mb-3">STEP 3</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
              YOUR <span className="text-glow-red">INFO</span>
            </h2>
            <p className="text-[#888]">So we can send you email updates on stats and your running total during the season</p>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-display text-sm text-[#888] tracking-wider mb-2">
                NAME <span className="text-[#CC0000]">*</span>
              </label>
              <input
                type="text"
                value={supporter.name}
                onChange={(e) => setSupporter((s) => ({ ...s, name: e.target.value }))}
                placeholder="Your full name"
                className="w-full bg-[#141414] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-[#555] focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]/50 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-display text-sm text-[#888] tracking-wider mb-2">
                EMAIL ADDRESS <span className="text-[#CC0000]">*</span>
              </label>
              <input
                type="email"
                value={supporter.email}
                onChange={(e) => setSupporter((s) => ({ ...s, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full bg-[#141414] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-[#555] focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]/50 transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-display text-sm text-[#888] tracking-wider mb-2">
                PHONE NUMBER <span className="text-[#CC0000]">*</span>
              </label>
              <input
                type="tel"
                value={supporter.phone}
                onChange={(e) => setSupporter((s) => ({ ...s, phone: e.target.value }))}
                placeholder="(555) 555-5555"
                className="w-full bg-[#141414] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-[#555] focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]/50 transition-colors"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-[#333] pt-6">
              <label className="block font-display text-sm text-[#888] tracking-wider mb-2">
                MAXIMUM DONATION CAP <span className="text-[#555]">(optional)</span>
              </label>
              <p className="text-xs text-[#555] mb-3">
                Set a cap if you&apos;d like to limit your total donation regardless of stats.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[#888] font-display text-lg">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="No cap"
                  value={cap}
                  onChange={(e) => setCap(e.target.value)}
                  className="w-40 bg-[#141414] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-[#555] font-display text-lg focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              {hasCap && estimatedTotal > capNum && (
                <p className="text-[#CC0000] text-sm mt-3">
                  Your donation will be capped at ${capNum.toFixed(2)} (estimated total is ${estimatedTotal.toFixed(2)})
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">
              BACK
            </button>
            <button
              onClick={() => {
                posthog?.capture('dingathon_donor_info_entered', {
                  player_id: selectedPlayerId,
                  has_cap: !!(parseFloat(cap) > 0),
                });
                setStep(3);
              }}
              disabled={!canProceedStep2}
              className={`btn-primary flex-1 ${
                !canProceedStep2 ? 'opacity-30 cursor-not-allowed !transform-none' : ''
              }`}
            >
              REVIEW
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Step 3: Review + Submit                                           */
  /* ------------------------------------------------------------------ */

  if (step === 3) {
    const capNum = parseFloat(cap);
    const hasCap = !isNaN(capNum) && capNum > 0;

    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepIndicator />

          <div className="text-center mb-10">
            <span className="text-[#CC0000] font-display text-lg tracking-wider block mb-3">STEP 4</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
              REVIEW YOUR <span className="text-glow-red">PLEDGE</span>
            </h2>
          </div>

          {/* Player */}
          <div className="bg-[#141414] border border-[#333] rounded-lg p-6 mb-4 text-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-[#CC0000]">
              <Image
                src={selectedPlayer?.image?.replace('.jpg', '-mlb.jpg') || ''}
                alt={`${selectedPlayer?.firstName} ${selectedPlayer?.lastName}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <p className="font-display text-2xl text-white">
              {selectedPlayer?.firstName} {selectedPlayer?.lastName}
            </p>
            <p className="text-sm text-[#888]">#{selectedPlayer?.jerseyNumber} &middot; {selectedPlayer ? positionLabel(selectedPlayer) : ''}</p>
          </div>

          {/* Pledges summary */}
          <div className="bg-[#141414] border border-[#333] rounded-lg overflow-hidden mb-4">
            <div className="bg-[#1A1A1A] px-5 py-3 border-b border-[#333]">
              <p className="font-display text-sm text-[#888] tracking-wider">YOUR PLEDGES</p>
            </div>
            <div className="divide-y divide-[#222]">
              {nonZeroPledges.map((cat) => {
                const amt = pledges[cat.key] || 0;
                const stat = playerStats[cat.key] || 0;
                return (
                  <div key={cat.key} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-white">{cat.label}</span>
                      <span className="text-[#555] text-sm ml-2">
                        ${amt.toFixed(2)} / {cat.description.toLowerCase()}
                        {hasAnyStats && <> &times; {stat} (2025)</>}
                      </span>
                    </div>
                    {hasAnyStats ? (
                      <span className="text-[#CC0000] font-display text-lg">
                        ${(amt * stat).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[#888] font-display text-sm">
                        TBD
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141414] border-2 border-[#CC0000] rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-display text-lg text-[#888]">ESTIMATED TOTAL</span>
              {hasAnyStats ? (
                <span className="font-display text-3xl text-white text-glow-red">
                  ${effectiveTotal.toFixed(2)}
                </span>
              ) : (
                <span className="font-display text-2xl text-white text-glow-red">
                  TBD
                </span>
              )}
            </div>
            {!hasAnyStats && (
              <p className="text-sm text-[#888] mt-2">
                Total will be calculated from {selectedPlayer?.firstName}&apos;s actual game stats
              </p>
            )}
            {hasAnyStats && hasCap && (
              <p className="text-sm text-[#888] mt-2">
                Capped at ${capNum.toFixed(2)}
                {estimatedTotal > capNum && (
                  <span className="text-[#555]"> (uncapped: ${estimatedTotal.toFixed(2)})</span>
                )}
              </p>
            )}
          </div>

          {/* Supporter info */}
          <div className="bg-[#141414] border border-[#333] rounded-lg overflow-hidden mb-8">
            <div className="bg-[#1A1A1A] px-5 py-3 border-b border-[#333]">
              <p className="font-display text-sm text-[#888] tracking-wider">YOUR INFORMATION</p>
            </div>
            <div className="px-5 py-4 space-y-2">
              <p className="text-white">{supporter.name}</p>
              <p className="text-[#888] text-sm">{supporter.email}</p>
              <p className="text-[#888] text-sm">{supporter.phone}</p>
            </div>
          </div>

          {submitError && (
            <div className="bg-[#CC0000]/10 border border-[#CC0000] rounded-lg p-4 mb-6 text-center">
              <p className="text-[#CC0000]">{submitError}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">
              BACK
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`btn-primary flex-1 ${isSubmitting ? 'opacity-60 cursor-wait' : ''}`}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT PLEDGE'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Step 4: Confirmation                                              */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#CC0000]/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#CC0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
          THANK <span className="text-glow-red">YOU!</span>
        </h2>

        <p className="text-xl text-[#888] mb-2">
          Your pledge for <span className="text-white font-semibold">{selectedPlayer?.firstName} {selectedPlayer?.lastName}</span> is locked in.
        </p>

        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141414] border-2 border-[#CC0000] rounded-lg p-8 my-8 inline-block">
          <p className="text-[#888] font-display text-sm tracking-wider mb-2">ESTIMATED SEASON DONATION</p>
          {hasAnyStats ? (
            <p className="font-display text-5xl text-white text-glow-red">
              ${effectiveTotal.toFixed(2)}
            </p>
          ) : (
            <>
              <p className="font-display text-3xl text-white text-glow-red mt-1">
                TBD
              </p>
              <p className="text-xs text-[#888] mt-2">
                Based on {selectedPlayer?.firstName}&apos;s actual game stats
              </p>
            </>
          )}
        </div>

        <div className="bg-[#141414] border border-[#333] rounded-lg p-6 text-left max-w-lg mx-auto mb-10">
          <h3 className="font-display text-xl text-white mb-4">WHAT HAPPENS NEXT</h3>
          <ul className="space-y-3 text-[#888]">
            <li className="flex gap-3">
              <span className="text-[#CC0000] shrink-0">1.</span>
              We&apos;ll send you email updates on {selectedPlayer?.firstName}&apos;s stats and your running total during the season.
            </li>
            <li className="flex gap-3">
              <span className="text-[#CC0000] shrink-0">2.</span>
              The season runs Feb 28 &ndash; May 9 (20 games in the 680 Diablo League).
            </li>
            <li className="flex gap-3">
              <span className="text-[#CC0000] shrink-0">3.</span>
              After the final game, we&apos;ll calculate your total and send payment details.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-secondary inline-block text-center">
            BACK TO HOME
          </Link>
          <Link href="/roster" className="btn-primary inline-block text-center">
            MEET THE PLAYERS
          </Link>
        </div>
      </div>
    </div>
  );
}
