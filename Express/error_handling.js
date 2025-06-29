const express = require("express");
const app = express();
app.use(express.json());

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get("/items/:id", asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new AppError("Invalid ID format", 400);
  if (id === 0) throw new AppError("ID cannot be zero", 422);
  if (id > 100) throw new AppError("Item not found", 404);
  res.json({ id, name: `Item ${id}` });
}));

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[ERROR] ${status}: ${message}`);
  res.status(status).json({ error: message, status });
});

app.listen(3002, () => console.log("Error handling demo on port 3002"));
