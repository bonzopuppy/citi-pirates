import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error('Ding-A-Thon submission error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
