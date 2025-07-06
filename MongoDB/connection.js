const { MongoClient } = require("mongodb");

const URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "practice_db";

let client;

async function connect() {
  if (!client) {
    client = new MongoClient(URI);
    await client.connect();
    console.log("Connected to MongoDB");
  }
  return client.db(DB_NAME);
}

async function disconnect() {
  if (client) {
    await client.close();
    client = null;
    console.log("Disconnected from MongoDB");
  }
}

async function main() {
  const db = await connect();
  const col = db.collection("test");
  await col.insertOne({ name: "test_doc", ts: new Date() });
  const doc = await col.findOne({ name: "test_doc" });
  console.log("Found:", doc);
  await disconnect();
}

main().catch(console.error);
module.exports = { connect, disconnect };
