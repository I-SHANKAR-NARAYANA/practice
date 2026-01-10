const { createClient } = require("redis");

const publisher  = createClient();
const subscriber = createClient();

async function startPubSub() {
  await publisher.connect();
  await subscriber.connect();

  await subscriber.subscribe("notifications", (message, channel) => {
    console.log(`[${channel}] ${message}`);
  });

  await subscriber.subscribe("alerts", (message) => {
    const data = JSON.parse(message);
    if (data.level === "critical") {

      console.log("CRITICAL ALERT:", data.message);
    }
  });


  await publisher.publish("notifications", "User signed up");
  await publisher.publish("alerts", JSON.stringify({ level: "critical", message: "DB is down" }));
  await publisher.publish("notifications", "Order placed successfully");

  setTimeout(async () => {
    await subscriber.quit();
    await publisher.quit();
  }, 1000);
}

startPubSub().catch(console.error);

