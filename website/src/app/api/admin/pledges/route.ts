import { NextRequest, NextResponse } from 'next/server';
import { getPledges, savePledges, type Pledge } from '@/lib/pledges';

function verifyPassword(request: NextRequest): boolean {
  const authHeader = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  return !!adminPassword && authHeader === adminPassword;
}

export async function GET(request: NextRequest) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pledges = await getPledges();
  return NextResponse.json({ pledges });
}

export async function DELETE(request: NextRequest) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Pledge ID required' }, { status: 400 });
    }

    const pledges = await getPledges();
    const filtered = pledges.filter((p: Pledge) => p.id !== id);

    if (filtered.length === pledges.length) {
      return NextResponse.json({ error: 'Pledge not found' }, { status: 404 });
    }

    await savePledges(filtered);
    return NextResponse.json({ success: true, remaining: filtered.length });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
