'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Pledge {
  id: string;
  timestamp: string;
  playerId: string;
  supporter: {
    name: string;
    email: string;
    phone: string;
  };
  pledges: Record<string, number>;
  cap: number | null;
  estimatedTotal: number;
}

interface PlayerSummary {
  playerId: string;
  playerName: string;
  pledgeCount: number;
  totalEstimated: number;
  supporters: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const PLAYER_NAMES: Record<string, string> = {
  'aaron-cheng': 'Aaron Cheng',
  'anderson-berning': 'Anderson Berning',
  'christopher-justen': 'Christopher Justen',
  'damon-jung': 'Damon Jung',
  'garo-balabanian': 'Garo Balabanian',
  'gavin-wu': 'Gavin Wu',
  'jackson-evans': 'Jackson Evans',
  'joe-clemenson': 'Joe Clemenson',
  'samuel-zottarelli': 'Samuel Zottarelli',
  'sawyer-lurie': 'Sawyer Lurie',
  'xander-macdonald': 'Xander MacDonald',
  'zach-baden': 'Zach Baden',
};

const PARENT_EMAILS: Record<string, string> = {
  'aaron-cheng': 'ciaoirene@hotmail.com',
  'anderson-berning': 'amywlin@gmail.com',
  'christopher-justen': 'diane.chui@gmail.com',
  'damon-jung': 'rahsalee@gmail.com',
  'garo-balabanian': 'kriscowan@gmail.com',
  'gavin-wu': 'deannayick@gmail.com',
  'jackson-evans': 'gwenkalyanapu@hotmail.com',
  'joe-clemenson': 'lolitaclemenson@gmail.com',
  'samuel-zottarelli': 'meganzottarelli@gmail.com',
  'sawyer-lurie': 'beccaprowda@gmail.com',
  'xander-macdonald': 'aml169@yahoo.com',
  'zach-baden': 'afox@olive-events.com',
};

const STAT_LABELS: Record<string, string> = {
  singles: 'Singles',
  doubles: 'Doubles',
  triples: 'Triples',
  homeRuns: 'Home Runs',
  runsScored: 'Runs',
  rbis: 'RBIs',
  stolenBases: 'SB',
  strikeouts: 'K',
  defensiveOuts: 'DO',
  infieldAssists: 'IA',
  outfieldAssists: 'OA',
  doublePlays: 'DP',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatPledges(pledges: Record<string, number>): string {
  return Object.entries(pledges)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${STAT_LABELS[k] || k}: $${v.toFixed(2)}`)
    .join(', ');
}

function buildCsv(pledges: Pledge[]): string {
  const headers = [
    'Date',
    'Player',
    'Supporter Name',
    'Supporter Email',
    'Supporter Phone',
    'Singles',
    'Doubles',
    'Triples',
    'Home Runs',
    'Runs Scored',
    'RBIs',
    'Stolen Bases',
    'Strikeouts',
    'Defensive Outs',
    'Infield Assists',
    'Outfield Assists',
    'Double Plays',
    'Cap',
    'Estimated Total',
  ];

  const rows = pledges.map((p) => [
    formatDate(p.timestamp),
    PLAYER_NAMES[p.playerId] || p.playerId,
    p.supporter.name,
    p.supporter.email,
    p.supporter.phone,
    p.pledges.singles || 0,
    p.pledges.doubles || 0,
    p.pledges.triples || 0,
    p.pledges.homeRuns || 0,
    p.pledges.runsScored || 0,
    p.pledges.rbis || 0,
    p.pledges.stolenBases || 0,
    p.pledges.strikeouts || 0,
    p.pledges.defensiveOuts || 0,
    p.pledges.infieldAssists || 0,
    p.pledges.outfieldAssists || 0,
    p.pledges.doublePlays || 0,
    p.cap ?? '',
    p.estimatedTotal,
  ]);

  const escape = (v: unknown) => {
    const s = String(v);
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };

  return [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'pledges' | 'summary'>('summary');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPledges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pledges', {
        headers: { 'x-admin-password': password },
      });
      if (res.ok) {
        const data = await res.json();
        setPledges(data.pledges);
      }
    } catch (err) {
      console.error('Failed to fetch pledges:', err);
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    if (isAuthed) fetchPledges();
  }, [isAuthed, fetchPledges]);

  /* ---- Auth ---- */

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthed(true);
      } else {
        setAuthError('Wrong password');
      }
    } catch {
      setAuthError('Something went wrong');
    }
  }

  /* ---- Delete ---- */

  async function handleDelete(id: string) {
    if (!confirm('Delete this pledge? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch('/api/admin/pledges', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPledges((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete pledge:', err);
    } finally {
      setDeletingId(null);
    }
  }

  /* ---- Export ---- */

  function handleExport() {
    const csv = buildCsv(pledges);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ding-a-thon-pledges-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---- Summary data ---- */

  const playerSummaries: PlayerSummary[] = Object.values(
    pledges.reduce(
      (acc, p) => {
        if (!acc[p.playerId]) {
          acc[p.playerId] = {
            playerId: p.playerId,
            playerName: PLAYER_NAMES[p.playerId] || p.playerId,
            pledgeCount: 0,
            totalEstimated: 0,
            supporters: [],
          };
        }
        acc[p.playerId].pledgeCount++;
        acc[p.playerId].totalEstimated += p.estimatedTotal;
        if (!acc[p.playerId].supporters.includes(p.supporter.name)) {
          acc[p.playerId].supporters.push(p.supporter.name);
        }
        return acc;
      },
      {} as Record<string, PlayerSummary>
    )
  ).sort((a, b) => b.totalEstimated - a.totalEstimated);

  const grandTotal = pledges.reduce((sum, p) => sum + p.estimatedTotal, 0);

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  /* ---- Login gate ---- */
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="bg-[#141414] border border-[#333] rounded-lg p-8 text-center">
            <h1 className="font-display text-2xl text-white mb-1">ADMIN</h1>
            <p className="text-[#888] text-sm mb-6">Ding-A-Thon Dashboard</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-[#555] focus:border-[#CC0000] focus:outline-none mb-4"
            />
            {authError && <p className="text-[#CC0000] text-sm mb-4">{authError}</p>}
            <button type="submit" className="btn-primary w-full">
              LOG IN
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ---- Dashboard ---- */
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="text-[#555] text-sm hover:text-[#888] transition-colors">
              &larr; Back to site
            </Link>
            <h1 className="font-display text-3xl text-white mt-1">
              DING-A-THON <span className="text-[#CC0000]">ADMIN</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={pledges.length === 0}
              className="px-4 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white text-sm hover:border-[#555] transition-colors disabled:opacity-30"
            >
              Export CSV
            </button>
            <button
              onClick={fetchPledges}
              disabled={loading}
              className="px-4 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white text-sm hover:border-[#555] transition-colors disabled:opacity-30"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#141414] border border-[#333] rounded-lg p-4 text-center">
            <p className="text-[#888] text-xs font-display tracking-wider mb-1">TOTAL PLEDGES</p>
            <p className="font-display text-3xl text-white">{pledges.length}</p>
          </div>
          <div className="bg-[#141414] border border-[#333] rounded-lg p-4 text-center">
            <p className="text-[#888] text-xs font-display tracking-wider mb-1">ESTIMATED TOTAL</p>
            <p className="font-display text-3xl text-[#CC0000]">${grandTotal.toFixed(2)}</p>
          </div>
          <div className="bg-[#141414] border border-[#333] rounded-lg p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-[#888] text-xs font-display tracking-wider mb-1">PLAYERS WITH PLEDGES</p>
            <p className="font-display text-3xl text-white">{playerSummaries.length}</p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('summary')}
            className={`px-4 py-2 rounded-lg text-sm font-display tracking-wider transition-colors ${
              view === 'summary'
                ? 'bg-[#CC0000] text-white'
                : 'bg-[#1A1A1A] border border-[#333] text-[#888] hover:text-white'
            }`}
          >
            BY PLAYER
          </button>
          <button
            onClick={() => setView('pledges')}
            className={`px-4 py-2 rounded-lg text-sm font-display tracking-wider transition-colors ${
              view === 'pledges'
                ? 'bg-[#CC0000] text-white'
                : 'bg-[#1A1A1A] border border-[#333] text-[#888] hover:text-white'
            }`}
          >
            ALL PLEDGES
          </button>
        </div>

        {/* Summary view */}
        {view === 'summary' && (
          <div className="bg-[#141414] border border-[#333] rounded-lg overflow-hidden">
            <div className="bg-[#1A1A1A] px-5 py-3 border-b border-[#333]">
              <p className="font-display text-sm text-[#888] tracking-wider">PER-PLAYER TOTALS</p>
            </div>
            {playerSummaries.length === 0 ? (
              <p className="text-[#555] text-center py-12">No pledges yet</p>
            ) : (
              <div className="divide-y divide-[#222]">
                {playerSummaries.map((s) => (
                  <div key={s.playerId} className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{s.playerName}</p>
                      <p className="text-[#888] text-sm">
                        {s.pledgeCount} pledge{s.pledgeCount !== 1 ? 's' : ''} &middot;{' '}
                        {s.supporters.length} supporter{s.supporters.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-[#555] text-xs mt-1">{s.supporters.join(', ')}</p>
                    </div>
                    <p className="font-display text-2xl text-[#CC0000]">${s.totalEstimated.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All pledges view */}
        {view === 'pledges' && (
          <div className="bg-[#141414] border border-[#333] rounded-lg overflow-hidden">
            <div className="bg-[#1A1A1A] px-5 py-3 border-b border-[#333]">
              <p className="font-display text-sm text-[#888] tracking-wider">ALL PLEDGES</p>
            </div>
            {pledges.length === 0 ? (
              <p className="text-[#555] text-center py-12">No pledges yet</p>
            ) : (
              <div className="divide-y divide-[#222]">
                {[...pledges]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((p) => (
                    <div key={p.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-white font-semibold">{p.supporter.name}</p>
                            <span className="text-[#555]">&rarr;</span>
                            <p className="text-[#CC0000] font-semibold">
                              {PLAYER_NAMES[p.playerId] || p.playerId}
                            </p>
                          </div>
                          <p className="text-[#888] text-sm mt-1">
                            {p.supporter.email} &middot; {p.supporter.phone}
                          </p>
                          <p className="text-[#555] text-xs mt-1">{formatPledges(p.pledges)}</p>
                          <p className="text-[#555] text-xs mt-1">
                            {formatDate(p.timestamp)}
                            {p.cap && <> &middot; Cap: ${p.cap.toFixed(2)}</>}
                          </p>
                          {PARENT_EMAILS[p.playerId] && (
                            <p className="text-[#555] text-xs mt-1">
                              Confirmation sent to: {PARENT_EMAILS[p.playerId]}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <p className="font-display text-xl text-white">${p.estimatedTotal.toFixed(2)}</p>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="text-[#555] hover:text-[#CC0000] transition-colors text-sm disabled:opacity-30"
                            title="Delete pledge"
                          >
                            {deletingId === p.id ? '...' : '✕'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
