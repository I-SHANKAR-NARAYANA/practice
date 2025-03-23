const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "practice-consumer",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "practice-group" });
async function processMessage(topic, message) {
  const event = JSON.parse(message.value.toString());
  const key   = message.key?.toString();
  console.log(`[${topic}] key=${key}`, event);

  if (topic === "user-events" && event.type === "login") {
    console.log(`  -> User ${event.userId} logged in`);
  } else if (topic === "order-events" && event.type === "placed") {
    console.log(`  -> Order ${event.orderId} worth $${event.amount}`);
  }
}

async function main() {
  await consumer.connect();
  await consumer.subscribe({
    topics: ["user-events", "order-events"],
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await processMessage(topic, message);
    },
  });
}

main().catch(console.error);
process.on("SIGINT", async () => { await consumer.disconnect(); process.exit(0); });
