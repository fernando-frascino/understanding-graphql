import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const userExamples = [
  {
    id: "1",
    name: "Fernando Frascino",
    age: 30,
    money: 1250.3,
    isOk: true,
  },
  {
    id: "2",
    name: "Bruno Marin",
    age: 20,
    money: 350.9,
    isOk: false,
  },
];

const userSchema = buildSchema(`
  type Query {
    getUser(id: String!): User
    getAllUsers: [User!]!
  }

  type Mutation {
    register(name: String!, age: Int!, money: Float, isOk: Boolean): Boolean
  }

  type User {
    id: ID
    name: String
    age: Int
    money: Float
    isOk: Boolean
  }
`);

const root = {
  getUser: ({ id }: { id: string }) => {
    const user = userExamples.find((user) => user.id === id);
    if (!user) return null;
    return user;
  },
  getAllUsers: () => {
    return userExamples;
  },
  register: ({
    name,
    age,
    money,
    isOk,
  }: {
    name: string;
    age: number;
    money: number;
    isOk?: boolean;
  }) => {
    const newUser = {
      id: (Number(userExamples.at(-1)?.id) + 1).toString() || "0",
      name,
      age,
      money,
      isOk: isOk || true,
    };
    userExamples.push(newUser);
    return true;
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: userSchema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
