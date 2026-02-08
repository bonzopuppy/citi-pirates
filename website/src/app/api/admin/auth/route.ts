import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { Redis } from '@upstash/redis';

/* ------------------------------------------------------------------ */
/*  Rate limiting — max 5 attempts per 15 minutes per IP               */
/* ------------------------------------------------------------------ */

function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return true; // If no Redis, skip rate limiting (dev mode)

  const key = `auth-rate-limit:${ip}`;
  const attempts = await redis.incr(key);

  if (attempts === 1) {
    await redis.expire(key, 900); // 15-minute window
  }

  return attempts <= 5;
}

/* ------------------------------------------------------------------ */
/*  Auth endpoint                                                      */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!await checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Constant-time comparison to prevent timing attacks
    let isValid = false;
    try {
      const a = Buffer.from(password);
      const b = Buffer.from(adminPassword);
      isValid = a.length === b.length && timingSafeEqual(a, b);
    } catch {
      isValid = false;
    }

    if (isValid) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
