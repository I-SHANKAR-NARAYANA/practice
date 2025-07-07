const express = require("express");
const app = express();
app.use(express.json());

const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || token !== "Bearer secret123")
    return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: 1, role: "admin" };
  next();
};


const requests = {};
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  requests[ip] = (requests[ip] || 0) + 1;
  if (requests[ip] > 10)

    return res.status(429).json({ error: "Too many requests" });
  next();
};

app.use(logger);
app.use(rateLimiter);
app.get("/public", (req, res) => res.json({ message: "public route" }));
app.get("/secure", authenticate, (req, res) => res.json({ user: req.user }));
app.listen(3001, () => console.log("Middleware demo on port 3001"));
