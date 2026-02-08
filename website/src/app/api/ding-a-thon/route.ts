import { NextRequest, NextResponse } from 'next/server';
import playersData from '@/data/players.json';
import { getParentEmail } from '@/data/parent-emails';
import { sendPledgeNotification, sendSupporterConfirmation } from '@/lib/email';
import { addPledge } from '@/lib/pledges';

// Allowed stat categories for pledges
const VALID_PLEDGE_KEYS = new Set([
  'singles', 'doubles', 'triples', 'homeRuns', 'runsScored', 'rbis',
  'stolenBases', 'strikeouts', 'defensiveOuts', 'infieldAssists',
  'outfieldAssists', 'doublePlays',
]);

// Whitelist of valid player IDs (built once at module load)
const VALID_PLAYER_IDS = new Set(playersData.players.map((p) => p.id));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PLEDGE_PER_STAT = 1000; // $1,000 max per stat category
const MAX_CAP = 100000; // $100,000 max cap

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { playerId, supporter, pledges, cap, estimatedTotal } = body;

    // Validate playerId against whitelist
    if (!playerId || typeof playerId !== 'string' || !VALID_PLAYER_IDS.has(playerId)) {
      return NextResponse.json({ error: 'Invalid player selection' }, { status: 400 });
    }

    // Validate supporter fields exist and are strings
    if (
      !supporter?.name || typeof supporter.name !== 'string' ||
      !supporter?.email || typeof supporter.email !== 'string' ||
      !supporter?.phone || typeof supporter.phone !== 'string'
    ) {
      return NextResponse.json({ error: 'Name, email, and phone are required' }, { status: 400 });
    }

    // Validate supporter field lengths
    if (supporter.name.trim().length > 200 || supporter.email.trim().length > 254 || supporter.phone.trim().length > 20) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 });
    }

    // Validate email format
    if (!EMAIL_REGEX.test(supporter.email.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate pledges object
    if (!pledges || typeof pledges !== 'object') {
      return NextResponse.json({ error: 'Pledges are required' }, { status: 400 });
    }

    // Validate each pledge: must be a known category with a valid amount
    const sanitizedPledges: Record<string, number> = {};
    for (const [key, value] of Object.entries(pledges)) {
      if (!VALID_PLEDGE_KEYS.has(key)) continue; // Skip unknown keys
      const num = Number(value);
      if (typeof num !== 'number' || isNaN(num) || num < 0 || num > MAX_PLEDGE_PER_STAT) {
        return NextResponse.json({ error: `Invalid pledge amount for ${key}` }, { status: 400 });
      }
      if (num > 0) sanitizedPledges[key] = Math.round(num * 100) / 100; // Round to cents
    }

    if (Object.keys(sanitizedPledges).length === 0) {
      return NextResponse.json({ error: 'At least one pledge amount is required' }, { status: 400 });
    }

    // Validate cap
    const sanitizedCap = (cap && typeof cap === 'number' && cap > 0 && cap <= MAX_CAP)
      ? Math.round(cap * 100) / 100
      : null;

    // Look up the player (guaranteed to exist due to whitelist check above)
    const player = playersData.players.find((p) => p.id === playerId)!;

    // Build the pledge record
    const record = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      playerId,
      supporter: {
        name: supporter.name.trim().slice(0, 200),
        email: supporter.email.trim().slice(0, 254),
        phone: supporter.phone.trim().slice(0, 20),
      },
      pledges: sanitizedPledges,
      cap: sanitizedCap,
      estimatedTotal: typeof estimatedTotal === 'number' ? Math.round(estimatedTotal * 100) / 100 : 0,
    };

    // Save pledge to KV store
    await addPledge(record);

    // Look up parent email from server-only store (not in players.json)
    const parentEmail = getParentEmail(playerId);

    // Send emails — must await on serverless (Vercel kills the function after response)
    const emailData = {
      parentEmail: parentEmail || '',
      playerFirstName: player.firstName,
      playerLastName: player.lastName,
      playerJerseyNumber: player.jerseyNumber,
      supporterName: record.supporter.name,
      supporterEmail: record.supporter.email,
      supporterPhone: record.supporter.phone,
      pledges: record.pledges,
      cap: record.cap,
      estimatedTotal: record.estimatedTotal,
    };

    // Send both emails in parallel, but await them before responding
    const emailPromises: Promise<void>[] = [];

    if (parentEmail) {
      emailPromises.push(
        sendPledgeNotification(emailData).catch((err) => {
          console.error('Failed to send parent notification email:', err);
        })
      );
    }

    emailPromises.push(
      sendSupporterConfirmation(emailData).catch((err) => {
        console.error('Failed to send supporter confirmation email:', err);
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error('Ding-A-Thon submission error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
