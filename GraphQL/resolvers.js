const users = [{ id: "1", name: "Alice", email: "alice@test.com" }];
const posts  = [{
  id: "1", title: "Hello GraphQL", content: "Getting started.",
  authorId: "1", tags: ["intro"], createdAt: new Date().toISOString()
}];
let nextId = 2;

const resolvers = {
  Query: {
    user:  (_, { id }) => users.find(u => u.id === id),
    users: ()          => users,
    post:  (_, { id }) => posts.find(p => p.id === id),
    posts: (_, { tag }) => tag ? posts.filter(p => p.tags.includes(tag)) : posts,
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = { id: String(nextId++), name, email };
      users.push(user);
      return user;
    },
    createPost: (_, { title, content, authorId, tags = [] }) => {
      const post = { id: String(nextId++), title, content, authorId, tags, createdAt: new Date().toISOString() };
      posts.push(post);
      return post;
    },
    deletePost: (_, { id }) => {
      const i = posts.findIndex(p => p.id === id);
      if (i === -1) return false;
      posts.splice(i, 1);
      return true;
    },

  },
  Post: { author: (post) => users.find(u => u.id === post.authorId) },
  User: { posts: (user) => posts.filter(p => p.authorId === user.id) },
};

module.exports = resolvers;
