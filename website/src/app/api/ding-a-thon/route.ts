import { NextRequest, NextResponse } from 'next/server';
import playersData from '@/data/players.json';
import { sendPledgeNotification, sendSupporterConfirmation } from '@/lib/email';
import { addPledge } from '@/lib/pledges';

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

    // Save pledge to KV store
    await addPledge(record);

    // Send emails — must await on serverless (Vercel kills the function after response)
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

    // Send both emails in parallel, but await them before responding
    const emailPromises: Promise<void>[] = [];

    if (player.parentEmail) {
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
