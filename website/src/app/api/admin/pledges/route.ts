import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PLEDGES_FILE = path.join(process.cwd(), 'src/data/ding-a-thon-pledges.json');

function verifyPassword(request: NextRequest): boolean {
  const authHeader = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  return !!adminPassword && authHeader === adminPassword;
}

async function readPledges(): Promise<unknown[]> {
  try {
    const data = await fs.readFile(PLEDGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pledges = await readPledges();
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

    const pledges = await readPledges();
    const filtered = pledges.filter((p: unknown) => (p as { id: string }).id !== id);

    if (filtered.length === pledges.length) {
      return NextResponse.json({ error: 'Pledge not found' }, { status: 404 });
    }

    await fs.writeFile(PLEDGES_FILE, JSON.stringify(filtered, null, 2));
    return NextResponse.json({ success: true, remaining: filtered.length });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
