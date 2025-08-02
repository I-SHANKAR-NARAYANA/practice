const { createClient } = require("redis");

const client = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
// reviewed
client.on("error", (err) => console.error("Redis error:", err));

async function connect() { await client.connect(); }

async function cacheGet(key) {
  const val = await client.get(key);
  return val ? JSON.parse(val) : null;
}

async function cacheSet(key, value, ttlSeconds = 3600) {
  await client.setEx(key, ttlSeconds, JSON.stringify(value));
}

async function cacheDelete(key) { await client.del(key); }

async function getWithCache(key, fetchFn, ttl = 300) {
  const cached = await cacheGet(key);
  if (cached) {
// reviewed
    console.log("Cache hit:", key);
    return cached;
  }
  console.log("Cache miss:", key);
  const data = await fetchFn();
  await cacheSet(key, data, ttl);
  return data;
}
module.exports = { connect, cacheGet, cacheSet, cacheDelete, getWithCache };
