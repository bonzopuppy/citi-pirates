import { Redis } from '@upstash/redis';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Pledge {
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

/* ------------------------------------------------------------------ */
/*  Redis client (lazy-initialized)                                    */
/* ------------------------------------------------------------------ */

const PLEDGES_KEY = 'ding-a-thon-pledges';
const LOCK_KEY = 'ding-a-thon-pledges:lock';

function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN environment variables are required');
  }
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

/* ------------------------------------------------------------------ */
/*  Distributed lock (prevents race conditions)                        */
/* ------------------------------------------------------------------ */

async function acquireLock(redis: Redis, ttlMs = 5000, retries = 10): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    // SET NX with expiry — atomic "create if not exists"
    const acquired = await redis.set(LOCK_KEY, '1', { nx: true, px: ttlMs });
    if (acquired === 'OK') return true;
    // Wait a short random time before retrying
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));
  }
  return false;
}

async function releaseLock(redis: Redis): Promise<void> {
  await redis.del(LOCK_KEY);
}

/* ------------------------------------------------------------------ */
/*  CRUD helpers                                                       */
/* ------------------------------------------------------------------ */

export async function getPledges(): Promise<Pledge[]> {
  const redis = getRedis();
  const data = await redis.get<Pledge[]>(PLEDGES_KEY);
  return data ?? [];
}

export async function savePledges(pledges: Pledge[]): Promise<void> {
  const redis = getRedis();
  await redis.set(PLEDGES_KEY, pledges);
}

export async function addPledge(pledge: Pledge): Promise<void> {
  const redis = getRedis();

  if (!await acquireLock(redis)) {
    throw new Error('Could not acquire lock — please try again');
  }

  try {
    const existing = await getPledges();
    existing.push(pledge);
    await savePledges(existing);
  } finally {
    await releaseLock(redis);
  }
}

export async function deletePledge(id: string): Promise<boolean> {
  const redis = getRedis();

  if (!await acquireLock(redis)) {
    throw new Error('Could not acquire lock — please try again');
  }

  try {
    const pledges = await getPledges();
    const filtered = pledges.filter((p) => p.id !== id);
    if (filtered.length === pledges.length) return false; // Not found
    await savePledges(filtered);
    return true;
  } finally {
    await releaseLock(redis);
  }
}
