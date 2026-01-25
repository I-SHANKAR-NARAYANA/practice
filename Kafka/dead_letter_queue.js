const { Kafka } = require("kafkajs");

const kafka    = new Kafka({ clientId: "dlq-processor", brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "dlq-group" });
const producer = kafka.producer();

async function sendToDLQ(originalTopic, message, error) {
  await producer.send({
    topic: `${originalTopic}.dlq`,
    messages: [{
      key:   message.key,
      value: message.value,
      headers: {
        "x-original-topic": originalTopic,
        "x-error-message":  error.message,
        "x-failed-at":      new Date().toISOString(),
      },
    }],
  });
  console.log(`DLQ: message sent to ${originalTopic}.dlq`);
}

async function startWithDLQ(topic, handler, maxRetries = 3) {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          await handler(message);
          return;
        } catch (err) {
          console.warn(`Retry ${i + 1}/${maxRetries} failed:`, err.message);
          if (i === maxRetries - 1) await sendToDLQ(topic, message, err);
        }
      }
    },
  });
}

module.exports = { startWithDLQ };
