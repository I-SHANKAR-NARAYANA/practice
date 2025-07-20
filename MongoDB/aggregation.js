const { connect } = require("./connection");

async function salesByCategory() {
  const db = await connect();
  return db.collection("orders").aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: "$category",
        totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: { $multiply: ["$price", "$quantity"] } }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 }
  ]).toArray();
}

async function monthlyTrend() {
  const db = await connect();
  return db.collection("orders").aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]).toArray();
}

async function demo() {
  console.log("Sales by category:", await salesByCategory());
  console.log("Monthly trend:", await monthlyTrend());
}

demo().catch(console.error);
