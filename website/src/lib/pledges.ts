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
  const existing = await getPledges();
  existing.push(pledge);
  await savePledges(existing);
}
