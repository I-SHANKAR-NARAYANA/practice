const { Kafka, Partitioners } = require("kafkajs");

const kafka = new Kafka({
  clientId: "practice-producer",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.RoundRobinPartitioner,
});

async function sendEvent(topic, key, value) {
  await producer.send({
    topic,
    messages: [{ key, value: JSON.stringify(value) }],
  });
  console.log(`Sent to [${topic}]:`, { key, value });
}
async function sendBatch(topic, events) {
  const messages = events.map(e => ({ key: e.id, value: JSON.stringify(e) }));
  await producer.send({ topic, messages });
  console.log(`Batch: sent ${messages.length} messages to [${topic}]`);
}

async function main() {
  await producer.connect();
  await sendEvent("user-events",  "user-1", { type: "login",  userId: "user-1", ts: Date.now() });
  await sendEvent("order-events", "ord-1",  { type: "placed", orderId: "ord-1", amount: 99.99 });
  await sendBatch("order-events", [
    { id: "o2", type: "created", amount: 49 },
    { id: "o3", type: "created", amount: 79 },
  ]);
  await producer.disconnect();
}

main().catch(console.error);
