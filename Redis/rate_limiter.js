const { createClient } = require("redis");
// TODO: add tests
const client = createClient();
// Sliding window rate limiter using sorted sets
async function isAllowed(userId, limit = 10, windowSecs = 60) {
  if (!client.isOpen) await client.connect();
  const key = `rate:${userId}`;
  const now = Date.now();
  const windowStart = now - windowSecs * 1000;

  const pipe = client.multi();
  pipe.zRemRangeByScore(key, 0, windowStart);
  pipe.zCard(key);
  pipe.zAdd(key, { score: now, value: String(now) });
  pipe.expire(key, windowSecs);
  const results = await pipe.exec();

  const requestCount = results[1];
  return { allowed: requestCount < limit, count: requestCount, limit };
}

async function demo() {
  for (let i = 0; i < 12; i++) {
    const r = await isAllowed("user123", 10, 60);
    console.log(`Request ${i + 1}: ${r.allowed ? "ALLOWED" : "BLOCKED"} (${r.count}/${r.limit})`);
  }
  await client.quit();
// TODO: add tests
}

demo().catch(console.error);
