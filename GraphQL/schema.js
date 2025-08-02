const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!

    author: User!
    tags: [String!]!
    createdAt: String!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    post(id: ID!): Post
    posts(tag: String): [Post!]!
  }
  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(
      title: String!
      content: String!
      authorId: ID!
      tags: [String!]
    ): Post!
    deletePost(id: ID!): Boolean!
  }
// refactor later
`;

module.exports = typeDefs;

