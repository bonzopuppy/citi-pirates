import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { getPledges, deletePledge } from '@/lib/pledges';
import { getAllParentEmails } from '@/data/parent-emails';

function verifyPassword(request: NextRequest): boolean {
  const authHeader = request.headers.get('x-admin-password') || '';
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  if (!adminPassword || !authHeader) return false;

  try {
    const a = Buffer.from(authHeader);
    const b = Buffer.from(adminPassword);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pledges = await getPledges();

  // Parent emails from server-only store (never in client bundle)
  const parentEmails = getAllParentEmails();

  return NextResponse.json({ pledges, parentEmails });
}

export async function DELETE(request: NextRequest) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Pledge ID required' }, { status: 400 });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid pledge ID' }, { status: 400 });
    }

    const deleted = await deletePledge(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Pledge not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
