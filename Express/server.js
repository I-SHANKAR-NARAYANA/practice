const express = require("express");
const app = express();
app.use(express.json());

const users = [];
let nextId = 1;

app.get("/users", (req, res) => res.json(users));

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "name and email required" });
  const user = { id: nextId++, name, email };
  users.push(user);
  res.status(201).json(user);
});

app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "Not found" });
  Object.assign(user, req.body);
  res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  users.splice(idx, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log("Server running on port 3000"));
