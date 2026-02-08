import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import playersData from '@/data/players.json';
import { sendPledgeNotification, sendSupporterConfirmation } from '@/lib/email';

const PLEDGES_FILE = path.join(process.cwd(), 'src/data/ding-a-thon-pledges.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { playerId, supporter, pledges, cap, estimatedTotal } = body;

    // Validate required fields
    if (!playerId || typeof playerId !== 'string') {
      return NextResponse.json({ error: 'Player selection is required' }, { status: 400 });
    }

    if (!supporter?.name || !supporter?.email || !supporter?.phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required' }, { status: 400 });
    }

    // Validate at least one pledge > 0
    const pledgeValues = Object.values(pledges || {}) as number[];
    const hasAtLeastOnePledge = pledgeValues.some((v) => v > 0);
    if (!hasAtLeastOnePledge) {
      return NextResponse.json({ error: 'At least one pledge amount is required' }, { status: 400 });
    }

    // Look up the player
    const player = playersData.players.find((p) => p.id === playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 400 });
    }

    // Build the pledge record
    const record = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      playerId,
      supporter: {
        name: supporter.name.trim(),
        email: supporter.email.trim(),
        phone: supporter.phone.trim(),
      },
      pledges,
      cap: cap && cap > 0 ? cap : null,
      estimatedTotal: estimatedTotal || 0,
    };

    // Read existing pledges, append, write back
    let existing: unknown[] = [];
    try {
      const data = await fs.readFile(PLEDGES_FILE, 'utf-8');
      existing = JSON.parse(data);
    } catch {
      // File doesn't exist or is empty — start fresh
      existing = [];
    }

    existing.push(record);
    await fs.writeFile(PLEDGES_FILE, JSON.stringify(existing, null, 2));

    // Send emails (non-blocking — don't fail the pledge if emails fail)
    const emailData = {
      parentEmail: player.parentEmail,
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

    // Email to parent
    if (player.parentEmail) {
      sendPledgeNotification(emailData).catch((err) => {
        console.error('Failed to send parent notification email:', err);
      });
    }

    // Confirmation email to supporter
    sendSupporterConfirmation(emailData).catch((err) => {
      console.error('Failed to send supporter confirmation email:', err);
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error('Ding-A-Thon submission error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
