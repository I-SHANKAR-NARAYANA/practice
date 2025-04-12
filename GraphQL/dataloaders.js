const DataLoader = require("dataloader");

// Simulated database maps
const usersDB = {
  "1": { id: "1", name: "Alice", email: "alice@test.com" },
  "2": { id: "2", name: "Bob",   email: "bob@test.com"   },
};
const postsByUser = {
  "1": [{ id: "p1", title: "Alice's first post" }],
  "2": [{ id: "p2", title: "Bob learns GraphQL" }],
};

// DataLoader batches N individual loads into a single call
const userLoader = new DataLoader(async (userIds) => {
  console.log("Batch loading users:", userIds);
  return userIds.map(id => usersDB[id] || null);
});

const postsLoader = new DataLoader(async (userIds) => {
  console.log("Batch loading posts for:", userIds);
  return userIds.map(id => postsByUser[id] || []);
});

// Resolvers — no N+1 problem because of DataLoader
const resolvers = {
  Query: {
    user: (_, { id }) => userLoader.load(id),
  },
  User: {
    posts: (user) => postsLoader.load(user.id),
  },
};
module.exports = { userLoader, postsLoader, resolvers };
